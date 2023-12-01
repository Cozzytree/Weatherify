function Spinner({ className }) {
  return (
    <div
      className={`slowdown absolute inset-0 backdrop-blur-20 bg-stone-50/0 flex justify-center items-center ${className}`}
    >
      <div className="loader"></div>
    </div>
  );
}

export default Spinner;
