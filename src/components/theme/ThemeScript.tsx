/** Runs before paint to avoid a flash of the wrong theme. */
export function ThemeScript() {
  const script = `(function(){try{var k="onyx-theme";var s=localStorage.getItem(k);var d=s==="dark"||(!s&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
