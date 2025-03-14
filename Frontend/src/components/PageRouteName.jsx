function PageRouteName({ manga }) {
  return (
    <div className="capitalize w-fit border border-border bg-secondary mb-3 p-1 flex flex-wrap gap-1">
      <span>home</span>/<span>{manga.attributes.title.en}</span>
    </div>
  );
}

export default PageRouteName;
