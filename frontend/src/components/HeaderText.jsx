const HeaderText = ({children,color='#000'}) => {
  return (
    <h1 className="md:text-5xl text-[36px] font-fredoka font-semibold capitalize mt-2 mb-3 " style={{color,lineHeight:'1.2'}}>{children}</h1>
  )
}

export default HeaderText