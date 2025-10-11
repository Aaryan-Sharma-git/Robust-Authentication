import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10); // cost factor
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> =>
  await bcrypt.compare(password, hashedPassword);

export { comparePassword, hashPassword };
