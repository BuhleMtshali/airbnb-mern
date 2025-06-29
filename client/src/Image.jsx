
const ImageComponent = ({ src, ...rest }) => {
  const finalSrc = src && src.includes('https://') ? src : `http://localhost:4000/uploads/${src}`;
  return <img {...rest} src={finalSrc} alt="" />;
};

export default ImageComponent;
