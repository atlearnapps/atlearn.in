const Paragraph = ({children,color }) => {
  return <p className="text-lg mb-5 font-fredoka " style={{color,lineHeight:'1.75'}} dangerouslySetInnerHTML={{ __html: children }}></p>;
};

export default Paragraph;
