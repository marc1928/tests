import React from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";

export default function PageNotFound() {
  return (
    <>
      <NavBar />
      <SideBar />
      <main>
        <div class="container">
          <section class="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
            <h1>404</h1>
            <h2>The page you are looking for doesn't exist.</h2>
            <a class="btn">
              Back to home
            </a>
            <img
              src="assets/img/not-found.svg"
              class="img-fluid py-5"
              alt="Page Not Found"
            />
          </section>
        </div>
      </main>

      <a
        href="#"
        class="back-to-top d-flex align-items-center justify-content-center"
      >
        <i class="bi bi-arrow-up-short"></i>
      </a>
      <Footer />
    </>
  );
}
