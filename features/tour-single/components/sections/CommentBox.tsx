export default function CommentBox() {
  return (
    <>
      <h2 className='pt-60 text-30'>Leave a Reply</h2>
      <p className='mt-30'>
        Your email address will not be published. Required fields are marked *
      </p>

      <div className='pt-30 reviewsGrid'>
        <div className='reviewsGrid__item'>
          Location
          <div className='d-flex x-gap-5 pl-20'>
            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>
          </div>
        </div>

        <div className='reviewsGrid__item'>
          Amenities
          <div className='d-flex x-gap-5 pl-20'>
            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>
          </div>
        </div>

        <div className='reviewsGrid__item'>
          Food
          <div className='d-flex x-gap-5 pl-20'>
            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>
          </div>
        </div>

        <div className='reviewsGrid__item'>
          Room
          <div className='d-flex x-gap-5 pl-20'>
            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>
          </div>
        </div>

        <div className='reviewsGrid__item'>
          Price
          <div className='d-flex x-gap-5 pl-20'>
            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>
          </div>
        </div>

        <div className='reviewsGrid__item'>
          Tour Operator
          <div className='d-flex x-gap-5 pl-20'>
            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>

            <i className='text-10 text-yellow-2 icon-star'></i>
          </div>
        </div>
      </div>

      <div className='y-gap-30 pt-30 contactForm'>
        <div className='y-gap-30 row'>
          <div className='col-md-6'>
            <div className='form-input'>
              <input type='text' required />
              <label className='text-16 text-light-1 lh-1'>Name</label>
            </div>
          </div>

          <div className='col-md-6'>
            <div className='form-input'>
              <input type='email' required />
              <label className='text-16 text-light-1 lh-1'>Email</label>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <div className='form-input'>
              <input type='text' required />
              <label className='text-16 text-light-1 lh-1'>Title</label>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <div className='form-input'>
              <textarea required rows={5}></textarea>
              <label className='text-16 text-light-1 lh-1'>Comment</label>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <button className='text-white bg-accent-1 button -md -dark-1'>
              Post Comment
              <i className='icon-arrow-top-right ml-10 text-16'></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
