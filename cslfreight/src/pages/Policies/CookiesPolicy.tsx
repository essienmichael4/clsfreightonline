// import * as Separator from "@radix-ui/react-separator";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";

const sections = [
  { id: "cookies", title: "What are cookies?" },
  { id: "usage", title: "How do we use cookies?" },
  { id: "duration", title: "How long do we keep cookies?" },
  { id: "manage", title: "How can you manage cookies?" },
  { id: "links", title: "Useful links" },
  { id: "dnt", title: "Do Not Track (DNT)" },
];

const CookiesPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-8 md:flex-row">
        
        {/* 📌 Sidebar / TOC */}
        <aside className="md:w-1/4">
          <div className="sticky top-24 rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              On this page
            </h3>
            <ul className="space-y-2 text-sm">
              {sections.map(section => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-gray-600 hover:text-cyan-700 transition"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* 📄 Content */}
        <main className="md:w-3/4">
          <h1 className="text-3xl font-bold">Cookies Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: January 2026</p>

          <Separator className="my-6 h-px bg-gray-200" />

          <div className="space-y-6 text-sm leading-relaxed text-gray-700">

            <p>CSL Freight ("we", "our" or "us") uses certain monitoring and tracking technologies, such as cookies, web beacons and scripts (collectively, "Cookies"). These technologies are used in order to provide, maitain, and improve our services, and to provide our visitors (customers and "you") with a better experience (for example, to track user preferences, to better secure our service, to identify technical issues and to monitor and improve the overall performance of our services). </p>
            <p> This page contains information on what cookies are, the types of cookies we use, and how you can manage your cookie preferences. If you are unable to find the infomation you are looking for, or have any questions about our use of cookies, please contact us at <a className="text-cyan-700" href="mailto:contact@cslfreightgh.com">contact@cslfreightgh.com.</a> </p>
            <p>For more information about our general privacy policy, please visit <Link className="text-cyan-700" to="/privacy-policy">Privacy Policy</Link>.</p>

            {/* 1 */}
            <section id="cookies" className=" space-y-4">
              <h2 className="text-xl font-semibold">1. What are cookies?</h2>
              
              <p>Cookies are small text files that are stored through your web browser on your computer or mobile device (for example, Google Chrome or Safari) when you visit a website. They allow the site to store information like your preferred language or login information, so you don't have to re-enter it each time you visit the site or navigate from page to page. You can think of cookies as providing a "memory" for the website, so it can remember you and your preferences and give response appropriately. You are not obligated to accept all cookies, however, if you choose to disable certain cookies, this may impact your experience on our website and the services we are able to offer as it is required for most of our services to work. </p>
            </section>

            {/* 2 */}
            <section id="usage" className=" space-y-4">
              <h2 className="text-xl font-semibold">2. How do we use cookies?</h2>
              <p> CSL Freight uses several types of cookies for various purposes, including: </p> 
              <ul className="ml-4 space-y-2"> <li><strong>Essential Cookies:</strong> These cookies are necessary for the operation of our website and services. They enable you to navigate the site and use its features, such as accessing secure areas.</li> <li><strong>Performance Cookies:</strong> These cookies collect information about how visitors use our website, such as which pages are visited most often and if users encounter any error messages. This data helps us improve the performance and functionality of our site.</li> <li><strong>Functionality Cookies:</strong> These cookies allow our website to remember choices you make (such as your username, language, or region) and provide enhanced, more personalized features.</li> <li><strong>Advertising/Targeting Cookies:</strong> These cookies are used to deliver advertisements that are relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.</li> </ul>
            </section>

            {/* 3 */}
            <section id="duration" className=" space-y-4">
              <h2 className="text-xl font-semibold">3. How long do we keep cookies?</h2>
              <p>The length of time a cookie stays on your device depends on the type of cookie and the purpose for which it was set.</p>
              <p> Some cookies are session cookies, which expire when you close your browser, while others are persistent cookies that remain on your device for a specified period.</p>
            </section>

            {/* 4 */}
            <section id="manage" className=" space-y-4">
              <h2 className="text-xl font-semibold">4. How can you manage cookies?</h2>
              <p>You can manage your cookie preferences through your browser settings. Most browsers allow you to delete or reject cookies. However, if you choose to disable certain cookies, this may impact your experience on our website and the services we are able to offer as it is required for most of our services to work.</p> 
              <p>You can access <Link className="text-cyan-700" to="/cookie-settings">Cookie Settings</Link> to manage your preferences.</p> 
              <p>Also, you can adjust your browser settings to manage cookies, usually found in the "Privacy" or "Security" section of your browser's settings. In order to delete stored cookies or change these settings, the following links may be helpful:</p> 
              <ul className="ml-4 space-y-2"> 
                <li><a className="text-cyan-700" href="https://support.google.com/chrome/answer/95647?hl=en" target="_blank" rel="noopener noreferrer">Google Chrome</a></li> 
                <li><a className="text-cyan-700" href="https://support.apple.com/en-il/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li> 
                <li><a className="text-cyan-700" href="https://support.microsoft.com/en-us/help/17442" target="_blank" rel="noopener noreferrer">Internet Explorer</a></li> 
                <li><a className="text-cyan-700" href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li> 
                <li><a className="text-cyan-700" href="https://support.apple.com/en-us/HT201265" target="_blank" rel="noopener noreferrer">Safari Mobile</a></li> 
                <li><a className="text-cyan-700" href="https://support.google.com/chrome/answer/95647?hl=en" target="_blank" rel="noopener noreferrer">Android Browser</a></li> 
              </ul>
            </section>

            {/* 5 */}
            <section id="links" className=" space-y-4">
              <h2 className="text-xl font-semibold">5. Useful links</h2>
              <p>For more information regarding cookies, please visit the following resources:</p> 
              <ul className="ml-4 space-y-2"> 
                <li><a className="text-cyan-700" href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer">AboutCookies.org</a></li> 
                <li><a className="text-cyan-700" href="https://www.cookiechoices.org/" target="_blank" rel="noopener noreferrer">CookieChoices.org</a></li> 
              </ul>
            </section>

            {/* 6 */}
            <section id="dnt" className=" space-y-4">
              <h2 className="text-xl font-semibold">
                6. Do Not Track (DNT) signals
              </h2>
              <p>Some browsers allow users to opt out of tracking by sending a "Do Not Track" signal. However, we do not currently respond to these signals and do not guarantee that our services will respect them.</p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CookiesPolicy;
