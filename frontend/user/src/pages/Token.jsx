// import React from "react";
// import { useParams } from "react-router-dom";

// function Token() {
//   const { tokenId } = useParams();

//   // Mock Data
//   const token = {
//     id: tokenId,
//     office: "Ahmedabad RTO",
//     service: "Driving License Renewal",
//     tokenNumber: "A-127",
//     currentServing: "A-119",
//     peopleAhead: 8,
//     estimatedWait: 22,
//     status: "Waiting",
//   };

//   return (
//     <section className="bg-slate-50 min-h-screen py-10">
//       <div className="max-w-5xl mx-auto px-4">

//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
//           <h1 className="text-3xl font-bold text-slate-900">
//             Token Tracking
//           </h1>

//           <p className="text-slate-500 mt-2">
//             Monitor your queue status in real-time.
//           </p>
//         </div>

//         {/* Token Card */}
//         <div className="bg-white rounded-2xl shadow-sm border p-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

//             <div>
//               <p className="text-sm text-slate-500">
//                 Token Number
//               </p>

//               <h2 className="text-5xl font-bold text-blue-600 mt-2">
//                 {token.tokenNumber}
//               </h2>
//             </div>

//             <div>
//               <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-medium">
//                 {token.status}
//               </span>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6 mt-8">

//             <div>
//               <p className="text-slate-500 text-sm">
//                 Office
//               </p>

//               <h3 className="font-semibold text-lg mt-1">
//                 {token.office}
//               </h3>
//             </div>

//             <div>
//               <p className="text-slate-500 text-sm">
//                 Service
//               </p>

//               <h3 className="font-semibold text-lg mt-1">
//                 {token.service}
//               </h3>
//             </div>

//           </div>
//         </div>

//         {/* Queue Stats */}
//         <div className="grid md:grid-cols-3 gap-6 mt-6">

//           <div className="bg-white rounded-2xl shadow-sm border p-6">
//             <p className="text-slate-500 text-sm">
//               Current Serving
//             </p>

//             <h3 className="text-3xl font-bold mt-2 text-green-600">
//               {token.currentServing}
//             </h3>
//           </div>

//           <div className="bg-white rounded-2xl shadow-sm border p-6">
//             <p className="text-slate-500 text-sm">
//               People Ahead
//             </p>

//             <h3 className="text-3xl font-bold mt-2">
//               {token.peopleAhead}
//             </h3>
//           </div>

//           <div className="bg-white rounded-2xl shadow-sm border p-6">
//             <p className="text-slate-500 text-sm">
//               Estimated Wait
//             </p>

//             <h3 className="text-3xl font-bold mt-2 text-blue-600">
//               {token.estimatedWait} min
//             </h3>
//           </div>

//         </div>

//         {/* Progress */}
//         <div className="bg-white rounded-2xl shadow-sm border p-6 mt-6">

//           <div className="flex justify-between mb-2">
//             <span className="font-medium">
//               Queue Progress
//             </span>

//             <span className="text-slate-500">
//               {token.currentServing} → {token.tokenNumber}
//             </span>
//           </div>

//           <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-blue-600 rounded-full"
//               style={{ width: "75%" }}
//             />
//           </div>

//         </div>

//         {/* AI Prediction */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white p-6 mt-6">

//           <h3 className="text-xl font-semibold">
//             AI Wait-Time Prediction
//           </h3>

//           <p className="mt-3 text-blue-100">
//             Based on current queue movement, your token is
//             expected to be called in approximately{" "}
//             <strong>{token.estimatedWait} minutes</strong>.
//           </p>

//         </div>

//       </div>
//     </section>
//   );
// }

// export default Token;

import React from "react";
import { useParams } from "react-router-dom";

function Token() {
  const { tokenId } = useParams();

  // Mock Data
  const token = {
    id: tokenId,
    office: "Ahmedabad RTO",
    service: "Driving License Renewal",
    tokenNumber: "A-127",
    currentServing: "A-119",
    peopleAhead: 8,
    estimatedWait: 22,
    status: "Waiting",
  };

  return (
    <section className="bg-slate-50 min-h-screen py-6 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Token</p>

              <h1 className="text-4xl font-bold text-blue-600">
                {token.tokenNumber}
              </h1>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              {token.status}
            </span>
          </div>

          <div className="mt-3">
            <h2 className="font-semibold">{token.office}</h2>

            <p className="text-sm text-slate-500">{token.service}</p>
          </div>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white rounded-xl border p-3 text-center">
            <p className="text-xs text-slate-500">Serving</p>

            <h3 className="text-xl font-bold text-green-600">
              {token.currentServing}
            </h3>
          </div>

          <div className="bg-white rounded-xl border p-3 text-center">
            <p className="text-xs text-slate-500">Ahead</p>

            <h3 className="text-xl font-bold">{token.peopleAhead}</h3>
          </div>

          <div className="bg-white rounded-xl border p-3 text-center">
            <p className="text-xs text-slate-500">Wait</p>

            <h3 className="text-xl font-bold text-blue-600">
              {token.estimatedWait}m
            </h3>
          </div>
        </div>
        {/* Progress */}
        <div className="bg-white rounded-xl border p-4 mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Queue Progress</span>

            <span>
              {token.currentServing} → {token.tokenNumber}
            </span>
          </div>

          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600" style={{ width: "75%" }} />
          </div>
        </div>

        {/* AI Prediction */}
        {/* AI Prediction */}
        <div className="bg-blue-600 text-white rounded-xl p-4 mt-4">
          <p className="text-sm font-medium">AI Prediction</p>

          <p className="text-xs text-blue-100 mt-1">
            Expected call in approximately
            <span className="font-semibold">
              {" "}
              {token.estimatedWait} minutes
            </span>
            .
          </p>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 md:hidden">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-xs text-slate-500">Ahead</p>

            <p className="font-bold">{token.peopleAhead}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Wait</p>

            <p className="font-bold text-blue-600">{token.estimatedWait}m</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Token</p>

            <p className="font-bold">{token.tokenNumber}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Token;
