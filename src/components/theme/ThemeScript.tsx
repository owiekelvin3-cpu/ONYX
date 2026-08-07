/** Applies saved theme before first paint to avoid flash. */
export function ThemeScript() {
  const script = `(function(){try{var k="onyx-theme";var s=localStorage.getItem(k);var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark");}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
