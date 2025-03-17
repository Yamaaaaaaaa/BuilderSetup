import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Web Builder</h1>
      <p className="mb-4">This is a simple web builder application built with GrapeJS, React, and Tailwind CSS.</p>
      <div className="mt-8">
        <Link to="/builder" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Launch Web Builder
        </Link>
      </div>
    </div>
  )
}

export default Home

