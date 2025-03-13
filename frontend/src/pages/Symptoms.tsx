import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import symptomsImage from "../assets/SymptomsImage.webp";

export const Symptoms = () => {
  return (
    <>
      <div className="w-full p-6 space-y-8 mt-16 flex flex-row items-center gap-5">
        <Card className="w-1/2 mb-0 shadow-xl border border-gray-300 bg-gradient-to-r from-gray-300 to-gray-700 text-white text-center p-[51px] rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Symptoms of Parkinson’s Disease
            </CardTitle>
            <p className="text-lg mt-0">
              Recognizing early signs to seek timely care
            </p>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
              <img
                src={symptomsImage}
                alt="AI Diagnosis"
                className="w-full h-full object-fit"
              />
            </AspectRatio>
          </CardContent>
        </Card>
        <Card className="w-1/2 shadow-lg border border-gray-200 bg-white rounded-lg p-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            Parkinson’s disease affects{" "}
            <strong>movement and cognitive functions</strong> due to the loss of
            dopamine-producing neurons in the brain. Symptoms gradually worsen
            over time.
          </p>
          <div className="space-y-4 pb-[18px]">
            <p className="text-red-600 font-semibold">
              Tremors:{" "}
              <span className="text-gray-700 font-normal">
                Involuntary shaking, often in hands or fingers, noticeable at
                rest.
              </span>
            </p>

            <p className="text-blue-600 font-semibold">
              Slowed Movement:{" "}
              <span className="text-gray-700 font-normal">
                Bradykinesia causes sluggish movements, making daily tasks
                harder.
              </span>
            </p>

            <p className="text-yellow-600 font-semibold">
              Muscle Rigidity:{" "}
              <span className="text-gray-700 font-normal">
                Stiff muscles limit movement and may cause discomfort or pain.
              </span>
            </p>

            <p className="text-purple-600 font-semibold">
              Postural Instability:{" "}
              <span className="text-gray-700 font-normal">
                Impaired balance and coordination increase the risk of falls.
              </span>
            </p>

            <p className="text-green-600 font-semibold">
              Facial Masking:{" "}
              <span className="text-gray-700 font-normal">
                Reduced facial expressions lead to a blank or emotionless look.
              </span>
            </p>

            <p className="text-indigo-600 font-semibold">
              Speech Changes:{" "}
              <span className="text-gray-700 font-normal">
                Softer, slurred, or hesitant speech patterns make difficult.
              </span>
            </p>
            <p className="text-indigo-600 font-semibold">
              Sleep Disturbances:{" "}
              <span className="text-gray-700 font-normal">
                Insomnia, restless legs, or vivid dreams can affect sleep.
              </span>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};
