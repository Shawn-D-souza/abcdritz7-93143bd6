import { ExternalLink } from "lucide-react";
import workshopData from "@/content/settings/workshop.json";

export function WorkshopPromo() {
  // If the promotion is not active, don't render anything
  if (!workshopData.isActive) return null;

  return (
    <div className="bg-card text-card-foreground border border-border/50 rounded-2xl overflow-hidden shadow-md flex flex-col sm:flex-row lg:flex-col mb-8 group transition-all duration-300 hover:shadow-lg hover:border-primary/30">
      {workshopData.image && (
        <div className="relative w-full sm:w-2/5 lg:w-full shrink-0 overflow-hidden aspect-video sm:aspect-auto lg:aspect-video">
          <img
            src={workshopData.image}
            alt={workshopData.imageAlt || "Workshop Promotion"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 lg:top-3 lg:left-3 bg-primary text-primary-foreground text-[9px] lg:text-xs font-bold px-1.5 py-0.5 lg:px-2 lg:py-1 rounded-md uppercase tracking-wider">
            Workshop
          </div>
        </div>
      )}
      <div className="p-3 sm:p-5 flex flex-col flex-grow justify-center">
        <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 leading-tight line-clamp-2">
          {workshopData.title}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-4 flex-grow">
          {workshopData.description}
        </p>
        {workshopData.url && (
          <a
            href={workshopData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold px-3 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-base rounded-lg w-fit lg:w-full transition-colors hover:bg-primary/90 mt-auto"
          >
            {workshopData.buttonText || "Learn More"}
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
          </a>
        )}
      </div>
    </div>
  );
}
