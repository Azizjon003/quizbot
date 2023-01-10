const enabled = async (ctx, User) => {
  const id = ctx.update.message.from.id;
  const user = await User.findOne({ where: { telegramId: id } });
  const name = ctx.update.message.from.first_name;
  if (user) {
    if (user.role == "admin") {
      return true;
    } else {
      return false;
    }
  } else {
    await User.create({
      telegramId: id,
      name: name,
    });
    return false;
  }
};

module.exports = enabled;
