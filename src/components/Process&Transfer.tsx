'use client';
import ProcessingStatusCardComponent from "./ProcessingStatusCard";

export default function ProcessAndTransferComponent() {
  return (
      <div>
          <h1 className=" font-bold text-lg my-2">
              Batch Processing
          </h1>
          <p className=" mb-2">
              We&#39;ll batch process your dust to minimize gas fees and transfer to Stellar via Soroban.
          </p>

          <ProcessingStatusCardComponent/>
    </div>
  )
}
