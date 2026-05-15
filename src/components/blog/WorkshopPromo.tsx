import { ExternalLink } from "lucide-react";
import workshopData from "@/content/settings/workshop.json";

export function WorkshopPromo() {
  // If the promotion is not active, don't render anything
  if (!workshopData.isActive) return null;

  return (
    <div className="bg-card text-card-foreground border border-border/50 rounded-2xl overflow-hidden shadow-md flex flex-col mb-8 group transition-all duration-300 hover:shadow-lg hover:border-primary/30">
      {workshopData.image && (
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={workshopData.image}
            alt={workshopData.imageAlt || "Workshop Promotion"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            Workshop
          </div>
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 leading-tight">
          {workshopData.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
          {workshopData.description}
        </p>
        {workshopData.url && (
          <a
            href={workshopData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-lg w-full transition-colors hover:bg-primary/90 mt-auto"
          >
            {workshopData.buttonText || "Learn More"}
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        )}
      </div>
    </div>
  );
}
