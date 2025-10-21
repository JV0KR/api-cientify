const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN || '7d' });
};

exports.register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol, bio, avatarUrl } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ message: 'Faltan datos' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email ya registrado' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ nombre, email, password: hashed, rol, bio, avatarUrl });
    const token = generateToken(user._id);
    res.status(201).json({ user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol }, token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Faltan datos' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = generateToken(user._id);
    res.json({ user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol }, token });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password; // no permitir cambio de password aquí (mejor endpoint dedicado)
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) { next(err); }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    // eliminación segura: podrías anonimizar en vez de borrar. Aquí borramos.
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Cuenta eliminada' });
  } catch (err) { next(err); }
};

exports.follow = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const me = req.user;
    if (me._id.equals(targetId)) return res.status(400).json({ message: 'No puedes seguirte a ti mismo' });

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: 'Usuario objetivo no existe' });

    if (!target.seguidores.includes(me._id)) {
      target.seguidores.push(me._id);
      me.siguiendo.push(target._id);
      await target.save();
      await me.save();
    }

    res.json({ message: 'Ahora sigues al usuario' });
  } catch (err) { next(err); }
};

exports.unfollow = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const me = req.user;
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: 'Usuario objetivo no existe' });

    target.seguidores = target.seguidores.filter(id => !id.equals(me._id));
    me.siguiendo = me.siguiendo.filter(id => !id.equals(target._id));
    await target.save();
    await me.save();

    res.json({ message: 'Has dejado de seguir al usuario' });
  } catch (err) { next(err); }
};
