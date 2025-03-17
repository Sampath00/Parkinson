import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import lifeStyleImage from "../assets/LifeStyleImage.webp";

export const Lifestyle = () => {
  return (
    <>
      <Card className="w-full shadow-lg border border-gray-200 bg-white rounded-lg p-6 space-y-8 mt-24 flex flex-row items-center gap-5">
        <Card className="w-1/2 mb-0 shadow-xl border border-gray-300 bg-gradient-to-r from-green-400 to-blue-500 text-white text-center p-[51px] rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Healthy Lifestyle for Parkinson’s
            </CardTitle>
            <p className="text-lg mt-0">
              Adopting positive habits to improve well-being
            </p>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
              <img
                src={lifeStyleImage}
                alt="AI Diagnosis"
                className="w-full h-full object-fit"
              />
            </AspectRatio>
          </CardContent>
        </Card>
        <div className="w-1/2">
          <p className="text-lg text-gray-700 leading-relaxed">
            While Parkinson’s disease cannot be cured, adopting a{" "}
            <strong>healthy lifestyle</strong> can{" "}
            <strong>improve symptoms and enhance quality of life</strong>.
          </p>
          <div className="space-y-4 mt-4">
            <p className="text-green-600 font-semibold">
              Balanced Diet:{" "}
              <span className="text-gray-700 font-normal">
                Eating nutrient-rich foods like fruits, vegetables, and lean
                proteins supports overall health.
              </span>
            </p>

            <p className="text-blue-600 font-semibold">
              Regular Exercise:{" "}
              <span className="text-gray-700 font-normal">
                Low-impact activities like yoga, walking, and stretching improve
                mobility and reduce stiffness.
              </span>
            </p>

            <p className="text-yellow-600 font-semibold">
              Quality Sleep:{" "}
              <span className="text-gray-700 font-normal">
                Good sleep habits help manage fatigue and enhance brain
                function.
              </span>
            </p>

            <p className="text-purple-600 font-semibold">
              Stress Management:{" "}
              <span className="text-gray-700 font-normal">
                Meditation, deep breathing, and social support reduce stress and
                anxiety.
              </span>
            </p>

            <p className="text-red-600 font-semibold">
              Avoiding Toxins:{" "}
              <span className="text-gray-700 font-normal">
                Limiting exposure to pesticides, heavy metals, and chemicals may
                slow disease progression.
              </span>
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};
