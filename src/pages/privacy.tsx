import { useEffect } from "react";

export function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex items-center flex-col">
      <article className="flex flex-col gap-4 max-w-3xl">
        <h1 className="text-5xl font-bold">Privacy Policy</h1>
        <h2 className="text-xl font-bold">
          Your rights in relation to privacy
        </h2>
        <p>
          Gunn Runners understands the importance of protecting the privacy of
          an individual&apos;s personal information. This statement sets out how
          and why we collect, hold, use and disclose your personal information
          and your rights in relation to the personal information we hold about
          you. In handling your personal information, we will comply with the
          Privacy Act 1988 (Privacy Act) and with the Australian Privacy
          Principles. We may vary and update this statement from time to time.
        </p>
        <h2 className="text-xl font-bold">
          What kinds of personal information does Gunn Runners collect?
        </h2>
        <p>
          Personal information is information or an opinion about an identified,
          or reasonably identifiable, individual. During the provision of our
          services and for the operation of Gunn Runners, we may collect your
          personal information.
        </p>
        <p>
          Generally, the kinds of personal information we collect are:
          <ul className="list-disc ml-4">
            <li>
              Contact and identification information such as your name, email
              addresses, telephone number(s), gender, age.
            </li>
            <li>Run finish times on Gunn Runners club nights.</li>
          </ul>
        </p>
        <h2 className="text-xl font-bold">
          How does Gunn Runners collect personal information?
        </h2>
        <p>
          Generally, we collect your personal information directly from you,
          through the completion of a manual or online form (including but not
          limited to a waiver form, a volunteer register and roster,
          registration on our website to receive our newsletter, or survey),
          through your use of the Gunn Runners website or social media
          platforms, or through your participation in any activity or event run
          by Gunn Runners.
        </p>
        <p>
          We may also collect information about the way you use our website
          including through the use of &apos;cookies&apos;. Cookies are small
          files that assist us to identify website user preferences so that we
          can enhance and tailor your experience of our website. Sometimes
          cookies result in the collection of personal information. You may
          disable the use of cookies through your internet browser. Generally,
          we will only collect your personal information from sources other than
          you if it is unreasonable or impracticable to collect your personal
          information from you.
        </p>
        <h2 className="text-xl font-bold">
          How we use your information and to whom may we disclose it
        </h2>
        <p>
          We collect, hold, use and disclose your personal information where it
          is reasonably necessary for the purposes of providing you, and our
          members generally, with our activities and services. While you are
          under no obligation to provide your personal information to us, we may
          not be able to provide our activities or services to you in the
          absence of certain information. Gunn Runners may also use your
          personal information for other purposes with your consent or in
          accordance with law. Where personal information is used or disclosed,
          we take steps reasonable in the circumstances to ensure it is relevant
          to the purposes for which it is to be used or disclosed.{" "}
        </p>
        <p>
          Gunn Runners engages certain trusted third parties (including data
          hosting and processing companies, and information technology
          providers, and operators of social media channels and platforms) to
          help us provide, improve and promote our services and communicate with
          you. We will only disclose your personal information to these third
          parties to perform tasks on our behalf and in compliance with this
          Privacy Policy. We take steps to ensure that our service providers are
          obliged to protect the privacy and security of your personal
          information and use it only for the purpose for which it is disclosed.
          In providing us with your personal information, you consent to this
          disclosure. Gunn Runners will not disclose your personal information
          for purposes or to parties other than those outlined above without
          your consent.
        </p>
        <h2 className="text-xl font-bold">
          Security of your personal information
        </h2>
        <p>
          We take steps reasonable in the circumstances to ensure that the
          personal information we hold is protected from misuse, interference
          and loss and from unauthorised access, modification or disclosure.
          Personal information is accessible only by authorised volunteers or
          other representatives of Gunn Runners.
        </p>
        <h2 className="text-xl font-bold">
          Can you access and correct the personal information that Gunn Runners
          holds about you?
        </h2>
        <p>
          Under the Privacy Act, you have a right to access and seek correction
          of your personal information that is collected and held by us. If at
          any time you would like to access or correct the personal information
          that we hold about you, or you would like more information on our
          approach to privacy, please contact us at
          gunnrunnersmelbourne@gmail.com. We will grant access to and correction
          of personal information to the extent required or authorised by the
          Privacy Act or other law. Upon making a request, you may be required
          to provide proof of identity and/or provide further details. We
          endeavour to respond to requests within 30 days and, if we refuse your
          request, will notify you of the refusal in writing.
        </p>
        <p>
          When you participate in a Gunn Runners run, we publish your name and
          finish time on our website. Should you wish for your data to be
          deleted, you will need to contact us at gunnrunnersmelbourne@gmail.com
          and we will endeavour to respond to your request within 30 days.
        </p>
        <h2 className="text-xl font-bold">Privacy complaints</h2>
        <p>
          Please direct any privacy complaint to our committee so that, if
          necessary, it can be appropriately investigated. Privacy complaints
          are treated seriously, promptly and confidentially and you will be
          notified of the outcome of your complaint. In the event that you are
          dissatisfied with the outcome of your complaint, you may refer the
          complaint to the Office of the Australian Information Commissioner.
        </p>
      </article>
    </div>
  );
}
