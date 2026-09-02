import Image from "next/image";
import FeedbackForm from "@/components/forms/FeedbackForm";

const Feedback = () => {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="CarePulse"
            className="mb-12 h-10 w-fit"
          />

          <FeedbackForm />

          <p className="copyright py-12">© 2026 CarePulse</p>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="Feedback"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Feedback;
