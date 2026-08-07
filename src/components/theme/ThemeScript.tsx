/** Runs before paint — default to TradingView-style dark theme. */
export function ThemeScript() {
  const script = `(function(){try{var k="onyx-theme";var s=localStorage.getItem(k);var d=s!=="light";if(d)document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark");}catch(e){document.documentElement.classList.add("dark");}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
