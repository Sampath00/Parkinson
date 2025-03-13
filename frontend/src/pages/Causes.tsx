import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import CauseImage from "../assets/CausesImg.webp";

export const Causes = () => {
  return (
    <>
      <div className="w-full p-6 space-y-8 mt-16 flex flex-row items-center gap-5">
        <Card className="w-1/2 mb-0 shadow-xl border border-gray-300 bg-gradient-to-r from-purple-600 to-blue-900 text-white text-center p-[51px] rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Causes of Parkinson’s Disease
            </CardTitle>
            <p className="text-lg mt-3">
              Understanding the factors behind Parkinson’s
            </p>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
              <img
                src={CauseImage}
                alt="AI Diagnosis"
                className="w-full h-full object-fit"
              />
            </AspectRatio>
          </CardContent>
        </Card>
        <Card className="w-1/2 shadow-lg border border-gray-200 bg-white rounded-lg p-6">
          <p className="text-lg text-gray-700 leading-relaxed">
          Parkinson’s disease arises from dopamine neuron loss, with genetic and environmental influences
          </p>
          <div className="space-y-4">
            <p className="text-blue-600 font-semibold">
              Genetic Mutations:{" "}
              <span className="text-gray-700 font-normal">
                Some inherited genetic mutations may contribute, though most
                cases are sporadic.
              </span>
            </p>

            <p className="text-green-600 font-semibold">
              Environmental Factors:{" "}
              <span className="text-gray-700 font-normal">
                Exposure to toxins, pesticides, or heavy metals may increase the
                risk.
              </span>
            </p>

            <p className="text-purple-600 font-semibold">
              Dopamine Loss:{" "}
              <span className="text-gray-700 font-normal">
                Damage to dopamine-producing cells in the brain plays a central
                role.
              </span>
            </p>

            <p className="text-yellow-600 font-semibold">
              Aging:{" "}
              <span className="text-gray-700 font-normal">
                A significant risk factor, as neuron degeneration naturally
                occurs over time.
              </span>
            </p>

            <p className="text-red-600 font-semibold">
              Oxidative Stress:{" "}
              <span className="text-gray-700 font-normal">
                Mitochondrial dysfunction and oxidative stress contribute to
                neuronal damage.
              </span>
            </p>

            <p className="text-gray-600 font-semibold">
              Head Injuries:{" "}
              <span className="text-gray-700 font-normal">
                Trauma or head injuries may increase the risk of
                Parkinson’s.
              </span>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};
