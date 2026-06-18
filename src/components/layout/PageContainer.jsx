const PageContainer = ({ children, className = '' }) => {
  const classes = ['mx-auto w-full max-w-[1440px] px-6 xl:px-8', className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
};

export default PageContainer;
