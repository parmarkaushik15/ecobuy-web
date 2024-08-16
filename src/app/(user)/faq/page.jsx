// import React from 'react';

// // mui
// import { Container } from '@mui/material';

// // component import
// // Next.js dynamic import
// import dynamic from 'next/dynamic';

// // skeleton component import
// import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
// const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
//   loading: () => <HeaderBreadcrumbsSkeleton />
// });

// export default function Page() {
//   return (
//     <>
//       <HeaderBreadcrumbs
//         heading="FAQ"
//         links={[
//           {
//             name: 'Home',
//             href: '/'
//           },
//           {
//             name: 'FAQ'
//           }
//         ]}
//       />
//       <Container maxWidth="xl">

//       </Container>
//     </>
//   );
// }
'use client';
import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import dynamic from 'next/dynamic';
import './Faq.css';
import * as api from 'src/services';

// Skeleton component import
import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    const getFaqData = async () => {
      const response = await api.getFaqData();

      if (response.success) {
        setFaqData(response.data);
      }
    };
    getFaqData();
  }, []);

  return (
    <section className="faq-section py-3">
      <div className="container">
        <div className="w-lg-50 mx-auto">
          <div className="accordion" id="accordionExample">
            {faqData.map((item, index) => (
              <div className="accordion-item question-item" key={index}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${activeIndex === index ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => handleToggle(index)}
                  >
                    <h5>{item.name}</h5>
                  </button>
                </h2>
                <div className={`accordion-collapse ${activeIndex === index ? 'show' : ''}`}>
                  <div className="accordion-body">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="accordion" id="accordionExample">
            <h2 className="shipping-text">Shipping</h2>
            {faqs.map((item, index) => (
              <div className="accordion-item question-item" key={index}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${activeIndex === index ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => handleToggle(index)}
                  >
                    <h5>{item.question}</h5>
                  </button>
                </h2>
                <div className={`accordion-collapse ${activeIndex === index ? 'show' : ''}`}>
                  <div className="accordion-body">{item.answer}</div>
                </div>
              </div>
            ))}
          </div> */}
          {/* <div className="accordion" id="accordionExample">
            <h2 className="payment-text">Payment</h2>
            {faqs.map((item, index) => (
              <div className="accordion-item question-item" key={index}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${activeIndex === index ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => handleToggle(index)}
                  >
                    <h5>{item.question}</h5>
                  </button>
                </h2>
                <div className={`accordion-collapse ${activeIndex === index ? 'show' : ''}`}>
                  <div className="accordion-body">{item.answer}</div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default function Page() {
  return (
    <>
      <HeaderBreadcrumbs
        heading="FAQ"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'FAQ'
          }
        ]}
      />
      <Container maxWidth="xl">
        <FAQ />
      </Container>
    </>
  );
}
