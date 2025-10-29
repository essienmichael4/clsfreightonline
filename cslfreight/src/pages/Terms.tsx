import Footer from "@/components/Footer";
import { Clock, Download } from "lucide-react";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

const Terms = () => {
  const termsRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!termsRef.current) return;

    const element = termsRef.current;
    element.classList.add("pdf-mode");

    const opt = {
        margin: [25, 25, 25, 25] as [number, number, number, number],
        filename: "CSL_Terms_and_Conditions.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] as const },
    };


    // Create the PDF
    await (html2pdf() as any).set(opt).from(element).save();
    element.classList.remove("pdf-mode");
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="mt-12 mb-10">
          <div className="px-6 mt-10 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-3xl sm:font-normal sm:text-6xl tracking-wide">
                  Our Terms & Conditions
                </h2>
                <p className="flex items-center text-sm gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  Last updated: 15 September 2025
                </p>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            <div ref={termsRef} className="mt-4 text-justify leading-relaxed">
              <h1 className="text-center font-bold text-2xl mb-4">
                CSL Freight Forwarding Ltd.
              </h1>
              <p className="text-center text-gray-500 mb-4">
                Terms & Conditions — Last updated: 15 September 2025
              </p>

              {[
                "We are a freight forwarding company and are responsible for your package collection, inspection, consolidation, container booking & ongoing customs clearance from the country of origin to the country of destination.",
                "The client (you) are responsible for packaging of your product, correct indication of your packages & timely payment of all customs & freight charges.",
                "We (CSL) reserve the right to reject hazardous, prohibited or improperly packaged cargo at our warehouse.",
                "Clients are responsible for insurance of their packages from port of origin to the country of destination but CSL is responsible only for packages within our warehouses.",
                "Provisional invoices are issued after loading in China, we will re-issue new invoices once packages arrive and are rechecked in Ghana for confirmation.",
                "Our minimum CBM is pegged at 0.01cbm and you are billed per consolidated LCL invoice. For FCL, please reach out to our admin for arrangements.",
                "Please note that your shipping fees do not include delivery to your destination - office or home but is offered on optional basis subjected to our terms and conditions.",
                "You are liable to pay GH¢ 100.00 per day/package as warehousing fees after 7 days of cargo arrival for pickup or delivery or pay at a declared flat rate as a consideration to customers.",
                "You shall pay at least 50% deposit of your total invoice 7 days after loading and full payment on container/vessel arrival at Tema port before customs clearance is completed.",
                "All fragile items must be covered and protected in styrofoam, wooden pallets and frame or get damaged at your own risk.",
                "Small packages have higher risks of getting lost. We cannot replace or refund for all such packages below 0.05cbm.",
                "For packages above 0.05cbm, we will refund the full cost of item but not exceeding 2 times the shipping costs.",
                "Our departure timelines are subject to cargo /ship or airplane availability.",
                "Vessel lines or Ship transit times may change without prior notice.",
                "Cargo may require inspection by customs and other regulatory bodies at their instance and time.",
                "We are committed to ensuring that your packages get to you safely and timely.",
                "Measurements will be re-taken at the warehouse in Ghana to confirm CBM before payments are made.",
                "Full payment of actual shipping fees with corresponding CBM is done in Ghana before pickup.",
                "Shipping rates for contraband or dangerous cargo and packages without MSDS are different from normal goods and are shipped in separate container loadings.",
                "Your goods will be security checked and if narcotics, ammunition, or banned substances are detected, persons will both be reported to relevant authorities without prior notice.",
                "You can only make payment into the assigned accounts attached to your invoice.",
                "Please note that all payments are in US Dollar rate with Ghana Cedi equivalent at the time of payment.",
                "We shall only keep your packages for a maximum of 30 days and after all means are exhausted, we will re-sell them at a fair price to retrieve our customs clearance and freight charges.",
                "Due to storage and security costs, we shall totally auction all unpaid packages in our warehouse by proper legal proceedings after 60 days.",
                "We do not do business with third parties apart from the registered persons and/or designated next of kin assigned from the day of registration as our client.",
                "Higher customs duty packages, all forklift related packages and/or packages over 400kg will be charged or billed at a different rate to cover for all such fees irrespective of whether they fall under NORMAL or SENSITIVE goods.",
              ].map((term, i) => (
                <div
                  key={i}
                  className="mt-4 gap-2 flex flex-col p-4 md:w-3/4 border-b border-gray-200"
                >
                  <h4 className="text-2xl text-gray-500"># {i + 1}</h4>
                  <p>{term}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
