import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import history from "history/browser";
import styles from "./App.module.scss";

const Spinner = () => <span>Loading...</span>;

const PAGES = {
  recognition: lazy(() => import("./Recognition")),
  speech: lazy(() => import("./Speech")),
  tensorflow: lazy(() => import("./Tensorflow")),
};

const getPage = (location: { hash: string }) => {
  const [path, hash = Object.keys(PAGES)[0]] =
    decodeURI(location.hash).match(/^#(.+)/) || [];
  return hash;
};

export default function App() {
  const ref = useRef(null);
  const [page, setPage] = useState(getPage(history.location));

  useEffect(() =>
    // location is an object like window.location
    history.listen(({ location, action, ...rest }) =>
      setPage(getPage(location))
    )
  );

  const Page = PAGES[page] || null;

  return (
    <section className={styles.App}>
      <h1 className={styles.Nav}>
        Speak
        {Object.keys(PAGES).map((page) => (
          <a key={page} href={`#${page}`}>
            {page}
          </a>
        ))}
        [{page}]
      </h1>
      <div ref={ref} className={styles.Fps} />
      <Suspense fallback={<Spinner />}>
        <Page />
      </Suspense>
    </section>
  );
}
