function Error({ children }) {
  return (
    <div className="w-screen flex justify-center mt-8 text-2xl font-bold text-stone-50 px-4 py-3 rounded-lg">
      <p className=" bg-stone-800/50 py-5 px-4 w-90 rounded-lg">{children}</p>
    </div>
  );
}

export default Error;
