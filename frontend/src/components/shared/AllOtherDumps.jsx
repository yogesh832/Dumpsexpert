import React from "react";
import sap from "../../assets/landingassets/sap.webp";
import azure from "../../assets/landingassets/azure.webp";
import aws from "../../assets/landingassets/aws.webp";
import gcp from "../../assets/landingassets/gcp.webp";
import salesforce from "../../assets/landingassets/salesforce.webp";
import cisco from "../../assets/landingassets/cisco.webp";
import comptia from "../../assets/landingassets/comptia.webp";
import pmi from "../../assets/landingassets/pmi.webp";
import microsoft from "../../assets/landingassets/microsoft.webp";
import oracle from "../../assets/landingassets/oracle.webp";
import isc2 from "../../assets/landingassets/isc2.webp";
import axelos from "../../assets/landingassets/axeloes.webp";

const dumps = [
  { name: "SAP", image: sap },
  { name: "AZURE DUMPS", image: azure },
  { name: "AWS DUMPS", image: aws },
  { name: "GCP DUMPS", image: gcp },
  { name: "SALESFORCE DUMPS", image: salesforce },
  { name: "CISCO DUMPS", image: cisco },
  { name: "COMPTIA DUMPS", image: comptia },
  { name: "PMI DUMPS", image: pmi },
  { name: "MICROSOFT DUMPS", image: microsoft },
  { name: "ORACLE DUMPS", image: oracle },
  { name: "ISC2 DUMPS", image: isc2 },
  { name: "AXELOS DUMPS", image: axelos },
];

const AllOtherDumps = () => {
  return (
    <div className="py-10 px-20 bg-white">
      <h2 className="text-2xl font-semibold text-center mb-8">All Other Dumps</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {dumps.map((dump, index) => (
          <div
            key={index}
            className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <div className="p-4 bg-white flex justify-center items-center h-24">
              <img src={dump.image} alt={dump.name} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="bg-red-600 text-white text-center py-2 font-semibold text-sm">
              {dump.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOtherDumps;
