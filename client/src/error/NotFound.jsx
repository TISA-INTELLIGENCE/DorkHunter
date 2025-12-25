const NotFound = () => {
  return (
    <div className="flex justify-center align-center">
      <div>
        <h3 className="text-lg font-bold">Not Found</h3>
        <p className="text-base mt-4">
          Soryy, The link you were looking for was not found. return{" "}
          <a href="/" className="text-blue-500 hover:text-blue-600">
            home
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
