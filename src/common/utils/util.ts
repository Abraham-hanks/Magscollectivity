export const genRandomXters = (no = 8, alphaNumeric = false): string => {
  let text = '';
  const possible = alphaNumeric ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' : '0123456789';
  for (let i = 0; i < no; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

// export const toKobo = (nairaValue: number): number => parseInt((nairaValue * 100).toString());

export const isEmail = (email: string): boolean => {
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
    return true;

  return false;
}
