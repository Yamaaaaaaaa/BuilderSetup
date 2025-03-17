import { Route, Routes } from "react-router-dom"
import BlogLayout from "../layouts/ClientLayout/ClientLayout"
import Home from "@/pages/Client/Home/Home"
import BuilderPage from "@/pages/Client/BuilderPage/BuilderPage"


const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BlogLayout />}>
        <Route index element={<Home />} />
        <Route path="builder" element={<BuilderPage />} />
      </Route>
    </Routes>
  )
}

export default ClientRoutes

