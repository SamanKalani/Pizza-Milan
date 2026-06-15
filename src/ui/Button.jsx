import { Link } from "react-router-dom";

function Button({ children, disabled, to, type, onClick }) {
  const base =
    "inline-block text-sm rounded-full bg-[#C40707] font-semibold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-[#910505] focus:outline-none focus:ring focus:ring-[#910505] focus:ring-offset-2";
  const styles = {
    primary: base + " px-4 py-3 md:px-6 md:py-4",
    small: base + " px-4 py-2 md:px-5 md:py-2.5 text-xs",
    round: base + " px-2.5 py-1 md:px-3.5 md:py-2 text-sm",
    secondary:
      "inline-block text-xs rounded-full border-2 border-stone-300 font-semibold uppercase tracking-wide text-stone-400 transition-colors duration-300 hover:text-stone-800 hover:bg-stone-300 focus:outline-none focus:bg-stone-300 focus:ring focus:ring-yellow-300 focus:ring-offset-2 px-4 py-2.5 md:px-6 md:py-4",
  };
  if (to)
    return (
      <Link className={styles[type]} to={to}>
        {children}
      </Link>
    );
  if (onClick)
    return (
      <button onClick={onClick} disabled={disabled} className={styles[type]}>
        {children}
      </button>
    );
  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
}

export default Button;
