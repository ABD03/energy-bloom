export const ImageLoader = ({ src, quality }: any) => {
  return `${src}?w=${200}&q=${quality || 75}`;
};
