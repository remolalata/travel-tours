import React from "react";

export default function PageHeader() {
  return (
    <section className="pageHeader -type-3">
      <div className="container">
        <div className="justify-between row">
          <div className="col-auto">
            <div className="breadcrumbs">
              <span className="breadcrumbs__item">
                <a href="#">Home</a>
              </span>
              <span>{" > "}</span>
              <span className="breadcrumbs__item">
                <a href="#">Tours</a>
              </span>
              <span>{" > "}</span>
              <span className="breadcrumbs__item">
                <a href="#">Phuket</a>
              </span>
            </div>
          </div>

          <div className="col-auto">
            <div className="pageHeader__subtitle">
              THE 10 BEST Boracay Tours & Activities
            </div>
          </div>
        </div>

        <div className="pt-30 row">
          <div className="col-auto">
            <h1 className="pageHeader__title">
              Explore all things to do in Phuket
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
