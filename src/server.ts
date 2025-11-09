import app from './app';

export const greet = (name: string): string => {
  return `Hello, ${name}`;
};

export const add = (a: number, b: number): number => {
  return a + b;
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
