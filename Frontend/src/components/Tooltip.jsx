
const Tooltip = ({ text, children, shrink }) => {
  return (
    <div className={`relative  ${shrink ? '':'group'} inline-block cursor-pointer`}>
      {/* Tooltip text */}
      <div className={` ${shrink ? 'hidden':'block'} absolute left-full translate-x-[10px] mb-2 w-max whitespace-nowrap rounded bg-secondary border border-border text-white text-sm px-2 py-1 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
        {text}
      </div>
      {/* Child element */}
      {children}
    </div>
  );
};

export default Tooltip;
