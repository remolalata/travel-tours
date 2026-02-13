const locations = [
  {
    id: 1,
    title: "Office Address",
    address: "Pangasinan, Manaoag, Philippines, 2430",
    contact: "Gr8 Escapes Travel & Tours",
  },
  {
    id: 2,
    title: "Phone",
    address: "Call us directly",
    contact: "+63 970 551 7169",
  },
  {
    id: 3,
    title: "WhatsApp",
    address: "Chat with us on WhatsApp",
    contact: "+63 970 551 7169",
  },
  {
    id: 4,
    title: "Viber",
    address: "Message us on Viber",
    contact: "+63 970 551 7169",
  },
];

export default function Locations() {
  return (
    <section className="layout-pt-lg">
      <div className="container">
        <div className="row y-gap-30">
          {locations.map((elm, i) => (
            <div key={i} className="col-lg-3 col-sm-6">
              <div className="px-30 text-center">
                <h3 className="text-30 md:text-24 fw-700">{elm.title}</h3>

                <div className="mt-20 md:mt-10">
                  {elm.address}
                  <br />
                  <br />
                  {elm.contact}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
