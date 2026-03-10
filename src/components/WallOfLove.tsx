import { Star, User } from "lucide-react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";

const reviews = [
  {
    author: "Surya Prakash Tiwari",
    text: "Perfect for Beginners\n\nThis has led to the emergence of a number of no-code communities, which provide a wealth of resources and support for people who are new to no-code.one such community I came across is of ABCD.",
    avatar: "/avatars/surya-prakash-tiwari.avif"
  },
  {
    author: "Shivansh Tiwari",
    text: "Supportive and Inspiring\n\nThe NoCode Community is a vibrant hub for innovation, empowering individuals to create tech solutions without traditional coding.",
    avatar: "/avatars/shivansh-tiwari.avif"
  },
  {
    author: "Abhilash KB",
    text: "Fun learning!\n\nFnally, a community where I actually learnt something and had fun in the process.",
    avatar: "/avatars/abhilash-kb.avif"
  },
  {
    author: "Smrithi",
    text: "Helped me save time\n\nBeing part of the no-code community has made a real difference in my role as a relationship manager in real estate. It’s helped me simplify tasks and handle client interactions better.",
    avatar: ""
  },
  {
    author: "Sangya",
    text: "Super effective!\n\nThe future is no code. It's a world where creativity knows no bounds, and innovation is accessible to everyone.",
    avatar: "/avatars/sangya.avif"
  },
  {
    author: "Richitha Roy",
    text: "Must-Join Community\n\nI've gained so much from the No-Code community. I now manage and track client work efficiently using No-Code tools.",
    avatar: "/avatars/richitha-roy.avif"
  },
  {
    author: "Prewal",
    text: "Learnt Something New\n\nI was comfortable with the session. It was knowledgeable. I learnt a lot of things yesterday which I wasn’t aware of. Overall it was a very good interactive session.",
    avatar: ""
  },
  {
    author: "Nischal Kotiyan",
    text: "Easy to follow\n\nThe session was great, and YouTube worked well for me. The pace was good, and the concepts were easy to follow.",
    avatar: ""
  }
];

export const WallOfLove = () => {
  return (
    <section className="pt-4 md:pt-6 pb-20 relative overflow-hidden" id="reviews">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Wall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Love</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Hear from our community members about their experiences and successes.
          </motion.p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          plugins={[
            AutoScroll({
              playOnInit: true,
              speed: 1,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
              startDelay: 0,
            }),
          ]}
          className="w-full cursor-grab active:cursor-grabbing"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {reviews.map((review, index) => {
              // Split title from content if there's a newline
              const parts = review.text.split('\n\n');
              const title = parts.length > 1 ? parts[0] : '';
              const content = parts.length > 1 ? parts.slice(1).join('\n\n') : review.text;

              return (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-6 rounded-2xl bg-white/5 dark:bg-black/20 border border-black/10 dark:border-white/10 backdrop-blur-md hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
                    <div>
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      
                      {title && (
                        <h3 className="font-semibold text-lg mb-2 text-foreground">{title}</h3>
                      )}
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        "{content}"
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex flex-shrink-0 items-center justify-center border border-black/5 dark:border-white/5">
                        {review.avatar ? (
                          <img 
                            src={review.avatar} 
                            alt={review.author} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{review.author}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
