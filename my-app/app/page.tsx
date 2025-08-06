"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import {
  Code,
  Database,
  Globe,
  Mail,
  Github,
  Linkedin,
  Download,
  ExternalLink,
  Terminal,
  Server,
  Layers,
  Eye,
  ArrowRight,
  Cpu,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendContactEmail } from "./actions/contact"

// Optimized Code Mist Background Component with performance improvements
const CodeMistBackground = ({ mouseX, mouseY, scrollY }: { mouseX: any; mouseY: any; scrollY: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<
    Array<{
      x: number
      y: number
      vx: number
      vy: number
      char: string
      opacity: number
      size: number
      life: number
      maxLife: number
      color: string
    }>
  >([])
  const lastFrameTime = useRef(0)
  const isVisible = useRef(true)

  const codeChars = useMemo(
    () => [
      "0",
      "1",
      "{",
      "}",
      "[",
      "]",
      "(",
      ")",
      "<",
      ">",
      "/",
      "\\",
      "=",
      "+",
      "-",
      "*",
      "&",
      "|",
      "^",
      "~",
      "function",
      "const",
      "let",
      "var",
      "if",
      "else",
      "for",
      "while",
      "return",
      "class",
      "import",
      "export",
      "React",
      "Node",
      "HTML",
      "CSS",
      "JS",
      "MongoDB",
      "API",
      "JSON",
      "HTTP",
      "GET",
      "POST",
      "async",
      "await",
      "Naman >= Danger",
      "Naman == Coder",
    ],
    [],
  )

  const colors = useMemo(() => ["#00ff41", "#0099ff", "#00ffff", "#39ff14", "#00ff88"], [])

  const initializeParticles = useCallback(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current

    // Set canvas to full window size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Increase particle count for full screen coverage
    particlesRef.current = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: Math.random() * 1.0 + 0.5,
      char: codeChars[Math.floor(Math.random() * codeChars.length)],
      opacity: Math.random() * 0.4 + 0.1,
      size: Math.random() * 10 + 8,
      life: Math.random() * 200 + 100,
      maxLife: Math.random() * 200 + 100,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  }, [codeChars, colors])

  const animate = useCallback(
    (currentTime: number) => {
      if (!isVisible.current) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Throttle animation to 60fps max
      if (currentTime - lastFrameTime.current < 8.33) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTime.current = currentTime

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Always maintain full screen size
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mouseXVal = mouseX.get()
      const mouseYVal = mouseY.get()
      const scrollVal = scrollY.get() * 0.001

      // Batch particle updates for better performance
      particlesRef.current.forEach((particle) => {
        // Update position with 
        particle.x += particle.vx + scrollVal * 5
        particle.y += particle.vy + 0.5

        // Add gentle horizontal drift
        particle.vx += (Math.random() - 0.5) * 0.05

        // Optimized mouse influence with distance check
        const dx = mouseXVal - particle.x
        const dy = mouseYVal - particle.y
        const distanceSquared = dx * dx + dy * dy

        if (distanceSquared < 40000) {
          // 200px squared
          const distance = Math.sqrt(distanceSquared)
          const force = (200 - distance) / 200
          particle.vx += (dx / distance) * force * 0.005
          particle.vy += (dy / distance) * force * 0.005
          particle.opacity = Math.min(0.8, particle.opacity + force * 0.03)
        }

        // Boundary wrapping
        if (particle.y > canvas.height + 50) {
          particle.y = -50
          particle.x = Math.random() * canvas.width
          particle.vx = (Math.random() - 0.5) * 0.3
          particle.vy = Math.random() * 0.5 + 0.2
        }

        if (particle.x < -50) particle.x = canvas.width + 50
        if (particle.x > canvas.width + 50) particle.x = -50

        // Life cycle
        particle.life--
        if (particle.life <= 0) {
          particle.life = particle.maxLife
          particle.char = codeChars[Math.floor(Math.random() * codeChars.length)]
          particle.color = colors[Math.floor(Math.random() * colors.length)]
          particle.opacity = Math.random() * 0.4 + 0.1
        }

        // Enhanced fade effect
        const lifeFactor = particle.life / particle.maxLife
        const positionFactor = 1 - (particle.y / canvas.height) * 0.3
        const currentOpacity = particle.opacity * lifeFactor * positionFactor * 0.7

        // Optimized drawing with reduced shadow operations
        ctx.save()
        ctx.font = `${particle.size}px 'JetBrains Mono', monospace`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = particle.color
        ctx.globalAlpha = currentOpacity

        // Single shadow for performance
        ctx.shadowBlur = 8
        ctx.shadowColor = particle.color
        ctx.fillText(particle.char, particle.x, particle.y)

        ctx.restore()

        // Velocity damping
        particle.vx *= 0.995
        particle.vy *= 0.998
      })

      // Simplified mist effect
      const mistGradient = ctx.createRadialGradient(mouseXVal, mouseYVal, 0, mouseXVal, mouseYVal, 300)
      mistGradient.addColorStop(0, "rgba(0, 255, 65, 0.02)")
      mistGradient.addColorStop(0.5, "rgba(0, 153, 255, 0.01)")
      mistGradient.addColorStop(1, "transparent")

      ctx.fillStyle = mistGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationRef.current = requestAnimationFrame(animate)
    },
    [mouseX, mouseY, scrollY, codeChars, colors],
  )

  useEffect(() => {
    // Intersection Observer to pause animation when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting
      },
      { threshold: 0 },
    )

    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }

    initializeParticles()
    animationRef.current = requestAnimationFrame(animate)

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
        initializeParticles()
      }
    }

    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
      observer.disconnect()
    }
  }, [animate, initializeParticles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full will-change-transform"
      style={{
        background: "radial-gradient(ellipse at center, #001122 0%, #000000 100%)",
        opacity: 0.8,
        transform: "translateZ(0)",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
      }}
    />
  )
}

// Optimized Typing Animation Component
const TypingAnimation = ({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
  className = "",
}: {
  texts: string[]
  speed?: number
  deleteSpeed?: number
  pauseTime?: number
  className?: string
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const targetText = texts[currentTextIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < targetText.length) {
            setCurrentText(targetText.slice(0, currentText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), pauseTime)
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, pauseTime])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <span className={className}>
      {currentText}
      <span className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity will-change-opacity`}>|</span>
    </span>
  )
}

// Optimized Scroll Progress Bar Component
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 origin-left z-50 will-change-transform"
      style={{
        scaleX: scrollYProgress,
        boxShadow: "0 0 10px rgba(0, 255, 65, 0.5)",
        transform: "translateZ(0)", // Force GPU acceleration
      }}
    />
  )
}

// Optimized Glowing Card Component
const GlowCard = ({ children, className = "", glowColor = "#00ff41", ...props }: any) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg backdrop-blur-md border border-white/10 will-change-transform ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(0,20,40,0.8) 0%, rgba(0,10,20,0.9) 100%)",
        transform: "translateZ(0)", // Force GPU acceleration
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 30px ${glowColor}40`,
      }}
      animate={{
        boxShadow: isHovered
          ? [`0 0 20px ${glowColor}20`, `0 0 40px ${glowColor}60`, `0 0 20px ${glowColor}20`]
          : `0 0 10px ${glowColor}10`,
      }}
      transition={{
        boxShadow: { duration: 2, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 },
        scale: { type: "spring", stiffness: 300, damping: 30 },
      }}
      {...props}
    >
      <div
        className="absolute inset-0 rounded-lg opacity-30"
        style={{
          background: `linear-gradient(45deg, ${glowColor}20, transparent, ${glowColor}20)`,
          backgroundSize: "200% 200%",
        }}
      />
      {children}
    </motion.div>
  )
}

// Optimized Project Card with lazy loading
const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }} // Reduced delay for smoother loading
      viewport={{ once: true, margin: "-50px" }}
      className="group will-change-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlowCard className="overflow-hidden h-full" glowColor={project.glowColor}>
        <div className="relative overflow-hidden">
          <motion.img
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-48 object-cover will-change-transform"
            style={{ transform: "translateZ(0)" }}
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }} // Faster transition
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />

          <motion.div
            className="absolute inset-0 flex items-center justify-center will-change-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }} // Faster transition
          >
            <div className="flex gap-3">
              <motion.button
                className="w-12 h-12 rounded-full bg-green-500/90 flex items-center justify-center backdrop-blur-sm will-change-transform"
                whileHover={{ scale: 1.1 }}
                style={{
                  boxShadow: "0 0 20px rgba(0, 255, 65, 0.5)",
                  transform: "translateZ(0)",
                }}
              >
                <Github className="w-6 h-6 text-white" />
              </motion.button>
              <motion.button
                className="w-12 h-12 rounded-full bg-blue-500/90 flex items-center justify-center backdrop-blur-sm will-change-transform"
                whileHover={{ scale: 1.1 }}
                style={{
                  boxShadow: "0 0 20px rgba(0, 153, 255, 0.5)",
                  transform: "translateZ(0)",
                }}
              >
                <ExternalLink className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 font-mono">{project.title}</h3>
          <p className="text-gray-300 mb-4 leading-relaxed font-mono text-sm">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((tech: string) => (
              <motion.span
                key={tech}
                className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-mono border border-green-500/30 will-change-transform"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 10px rgba(0, 255, 65, 0.5)",
                }}
                style={{ transform: "translateZ(0)" }}
              >
                {tech}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="w-full h-1 bg-gray-700 rounded-full mb-4 overflow-hidden will-change-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full will-change-transform"
              initial={{ width: 0 }}
              animate={{ width: isHovered ? "100%" : 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            />
          </motion.div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-mono bg-transparent will-change-transform"
            >
              <Github className="w-4 h-4 mr-2" />
              Code
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-mono will-change-transform"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Live
            </Button>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  )
}

// Optimized Skill Icon
const SkillIcon = ({ skill, index }: { skill: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }} // Reduced delay
      viewport={{ once: true, margin: "-50px" }}
      className="group will-change-transform"
    >
      <GlowCard className="p-6 h-full text-center" glowColor={skill.color}>
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border-2 backdrop-blur-sm will-change-transform"
          style={{
            borderColor: skill.color,
            backgroundColor: `${skill.color}20`,
            boxShadow: `0 0 15px ${skill.color}40`,
            transform: "translateZ(0)",
          }}
          whileHover={{
            rotate: 360,
            scale: 1.1,
            boxShadow: `0 0 25px ${skill.color}80`,
          }}
          transition={{ duration: 0.4 }} // Faster rotation
        >
          <skill.icon className="w-8 h-8" style={{ color: skill.color }} />
        </motion.div>

        <h3 className="text-lg font-semibold text-white font-mono mb-2">{skill.name}</h3>

        <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
          <motion.div
            className="h-2 rounded-full will-change-transform"
            style={{
              background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)`,
              boxShadow: `0 0 10px ${skill.color}60`,
              transform: "translateZ(0)",
            }}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            transition={{ duration: 1, delay: index * 0.05 }}
            viewport={{ once: true }}
          />
        </div>
        <span className="text-sm text-gray-400 font-mono">{skill.level}%</span>
      </GlowCard>
    </motion.div>
  )
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const [formStatus, setFormStatus] = useState<{
    type: "idle" | "loading" | "success" | "error"
    message: string
  }>({ type: "idle", message: "" })

  const { scrollYProgress } = useScroll()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 1000])

  const skills = useMemo(
    () => [
      { name: "HTML5", level: 95, color: "#e34c26", icon: Code },
      { name: "CSS3", level: 92, color: "#1572b6", icon: Layers },
      { name: "JavaScript", level: 90, color: "#f7df1e", icon: Terminal },
      { name: "React", level: 88, color: "#61dafb", icon: Globe },
      { name: "Next.js", level: 85, color: "#68a063", icon: Server },
      { name: "Tailwind CSS", level: 90, color: "#06b6d4", icon: Zap },
      { name: "MongoDB", level: 82, color: "#4db33d", icon: Database },
      { name: "Django", level: 80, color: "#00ff41", icon: Cpu },
    ],
    [],
  )

  const projects = useMemo(
    () => [
      {
        title: "E-Commerce Platform",
        description:
          "Sustainable e-commerce platform with carbon footprint tracking and eco-friendly product recommendations.",
        tech: ["React", "Django", "MongoDB", "Stripe", "Chart.js"],
        image: "/placeholder.svg?height=300&width=500&text=EcoCommerce+Platform",
        glowColor: "#00ff41",
      },
      {
        title: "Personal Finance Tracker",
        description: "Intelligent finance tracker with AI-driven budgeting, investment insights, and expense categorization with OCR scaan.",
        tech: ["React", "next.js", "Django", "Mongodb", "python","Chart.js"],
        image: "/placeholder.svg?height=300&width=500&text=DevFlow+Task+Manager",
        glowColor: "#0099ff",
      },
      {
        title: "Personal Voice Assistant(Aura+)",
        description:
          "AI-powered voice assistant for task management, reminders, and smart home control with natural language processing.",
        tech: ["React", "Flask", "Fast API", "python"],
        image: "/placeholder.svg?height=300&width=500&text=CodeMist+Weather",
        glowColor: "#00ffff",
      },
    ],
    [],
  )

  // Handle form submission
  const handleFormSubmit = async (formData: FormData) => {
    setFormStatus({ type: "loading", message: "Sending your message..." })

    try {
      const result = await sendContactEmail(formData)

      if (result.success) {
        setFormStatus({ type: "success", message: result.message })
        // Reset form after successful submission
        const form = document.getElementById("contact-form") as HTMLFormElement
        if (form) form.reset()
      } else {
        setFormStatus({ type: "error", message: result.message })
      }
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "Sorry, there was an error sending your message. Please try again later.",
      })
    }

    // Clear status after 5 seconds
    setTimeout(() => {
      setFormStatus({ type: "idle", message: "" })
    }, 5000)
  }

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          mouseX.set(e.clientX)
          mouseY.set(e.clientY)
          ticking = false
        })
        ticking = true
      }
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = ["home", "about", "skills", "projects", "contact"]
          const scrollPosition = window.scrollY + 100

          sections.forEach((section) => {
            const element = document.getElementById(section)
            if (element) {
              const offsetTop = element.offsetTop
              const offsetHeight = element.offsetHeight

              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(section)
              }
            }
          })

          // Optimized scroll animations
          const animatedElements = document.querySelectorAll(".scroll-animate")
          animatedElements.forEach((element) => {
            const rect = element.getBoundingClientRect()
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0

            if (isVisible) {
              element.classList.add("animate-in")
            }
          })

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [mouseX, mouseY])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Code Mist Background */}
      <CodeMistBackground mouseX={springX} mouseY={springY} scrollY={scrollY} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-green-500/20 will-change-transform">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold font-mono text-green-400 will-change-transform"
              style={{
                textShadow: "0 0 10px #00ff41",
                fontFamily: "'JetBrains Mono', monospace",
                transform: "translateZ(0)",
              }}
            >
              <TypingAnimation
                texts={["<NB.dev/>", "<Naman.js/>", "<Bagrecha.tsx/>", "<FullStack.dev/>", "<NB.dev/>"]}
                speed={150}
                deleteSpeed={100}
                pauseTime={3000}
                className="text-green-400"
              />
            </motion.div>
            <div className="flex items-center space-x-8">
              {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`relative font-mono text-sm transition-all duration-300 will-change-transform ${
                    activeSection === item.toLowerCase()
                      ? "text-green-400 glow-text"
                      : "text-gray-400 hover:text-green-400"
                  }`}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    transform: "translateZ(0)",
                  }}
                >
                  {item}
                  {activeSection === item.toLowerCase() && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-400 will-change-transform"
                      style={{
                        boxShadow: "0 0 8px #00ff41",
                        transform: "translateZ(0)",
                      }}
                    />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative z-20 pt-20">
        <div className="text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 font-mono will-change-transform"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                background: "linear-gradient(45deg, #00ff41, #0099ff, #00ffff)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 30px rgba(0, 255, 65, 0.5)",
                transform: "translateZ(0)",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              NAMAN
              <br />
              <span className="text-5xl md:text-7xl">BAGRECHA</span>
            </motion.h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 mx-auto mb-8 will-change-transform"
              style={{
                boxShadow: "0 0 20px rgba(0, 255, 65, 0.5)",
                transform: "translateZ(0)",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mb-12"
          >
            <GlowCard className="p-8 max-w-4xl mx-auto" glowColor="#00ff41">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="space-y-4"
              >
                <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed font-mono">
                  <span className="text-green-400 font-semibold">Full-Stack Developer</span>
                </p>
                <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-mono">
                  Crafting digital experiences through the{" "}
                  <span className="text-blue-400 font-semibold">art of code</span> and{" "}
                  <span className="text-cyan-400 font-semibold">innovative solutions</span>
                </p>

                <motion.div
                  className="text-green-400 font-mono text-lg min-h-[2rem] flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  <span className="text-green-400">{">"} </span>
                  <TypingAnimation
                    texts={[
                      "Specializing in: Django | MongoDB | Python",
                      "Building with: HTML | CSS | JavaScript | React ",
                      "Crafting: Responsive Design | Modern UI/UX",
                      "Creating: Full-Stack Applications | APIs",
                      "Other skills : Tailwind CSS | TypeScript | Next.js",
                    ]}
                    speed={80}
                    deleteSpeed={40}
                    pauseTime={1500}
                    className="text-green-400"
                  />
                </motion.div>
              </motion.div>
            </GlowCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.button
              className="code-button will-change-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              style={{ transform: "translateZ(0)" }}
            >
              <Eye className="w-5 h-5 mr-2" />
              explore_projects()
            </motion.button>
            <motion.button
              className="code-button blue will-change-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              style={{ transform: "translateZ(0)" }}
            >
              <Mail className="w-5 h-5 mr-2" />
              contact_me()
            </motion.button>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 15, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 will-change-transform"
            style={{ transform: "translateZ(0)" }}
          >
            <div className="w-6 h-10 border-2 border-green-400 rounded-full flex justify-center relative">
              <motion.div
                className="w-1 h-3 bg-green-400 rounded-full mt-2 will-change-opacity"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative z-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2
              className="text-5xl font-bold mb-4 font-mono text-green-400 will-change-transform"
              style={{
                textShadow: "0 0 10px #00ff41",
                fontFamily: "'JetBrains Mono', monospace",
                transform: "translateZ(0)",
              }}
            >
              {"// about_me"}
            </h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto will-change-transform"
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              style={{ transform: "translateZ(0)" }}
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <GlowCard className="p-8" glowColor="#0099ff">
                <div className="space-y-6 text-gray-300 leading-relaxed font-mono">
                  <p className="text-lg">
                    I'm a passionate <span className="text-green-400 font-semibold">Full-Stack Developer</span> who
                    believes in the power of clean code and innovative solutions. My journey in technology is driven by
                    curiosity and a commitment to creating meaningful digital experiences.
                  </p>
                  <p className="text-lg">
                    Specializing in modern web technologies including{" "}
                    <span className="text-blue-400 font-semibold">React</span>,{" "}
                    <span className="text-green-400 font-semibold">Django</span>, and{" "}
                    <span className="text-cyan-400 font-semibold">MongoDB</span>. I transform complex problems into
                    elegant, scalable solutions.
                  </p>

                  <motion.div
                    className="bg-black/50 p-4 rounded-lg border border-green-500/30 font-mono text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-green-400">const developer = {"{"}</div>
                    <div className="ml-4 text-blue-400">
                      name: <span className="text-yellow-400">"Naman Bagrecha"</span>,
                    </div>
                    <div className="ml-4 text-blue-400">
                      passion: <span className="text-yellow-400">"Full-Stack Development"</span>,
                    </div>
                    <div className="ml-4 text-blue-400">
                      skills: <span className="text-cyan-400">["React", "Django", "MongoDB"]</span>
                    </div>
                    <div className="text-green-400">{"}"}</div>
                  </motion.div>
                </div>
              </GlowCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative"
            >
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-16 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Code className="w-24 h-24 text-green-400" />
                </div>

                {[
                  { icon: Globe, color: "#61dafb", delay: 0 },
                  { icon: Server, color: "#68a063", delay: 0.5 },
                  { icon: Database, color: "#4db33d", delay: 1 },
                  { icon: Terminal, color: "#f7df1e", delay: 1.5 },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border will-change-transform"
                    style={{
                      borderColor: item.color,
                      backgroundColor: `${item.color}20`,
                      boxShadow: `0 0 15px ${item.color}40`,
                      top: `${20 + Math.sin((index * Math.PI) / 2) * 30}%`,
                      left: `${20 + Math.cos((index * Math.PI) / 2) * 30}%`,
                      transform: "translateZ(0)",
                    }}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      y: { duration: 3, repeat: Number.POSITIVE_INFINITY, delay: item.delay },
                      rotate: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 relative z-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2
              className="text-5xl font-bold mb-4 font-mono text-green-400 will-change-transform"
              style={{
                textShadow: "0 0 10px #00ff41",
                fontFamily: "'JetBrains Mono', monospace",
                transform: "translateZ(0)",
              }}
            >
              {"// tech_stack"}
            </h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto mb-6 will-change-transform"
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              style={{ transform: "translateZ(0)" }}
            />
            <motion.p
              className="text-xl text-gray-300 font-mono"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Technologies powering my development arsenal
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.05 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {skills.map((skill, index) => (
              <SkillIcon key={skill.name} skill={skill} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-5xl font-bold mb-4 font-mono text-green-400 will-change-transform"
              style={{
                textShadow: "0 0 10px #00ff41",
                fontFamily: "'JetBrains Mono', monospace",
                transform: "translateZ(0)",
              }}
            >
              {"// projects"}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto mb-6" />
            <p className="text-xl text-gray-300 font-mono max-w-3xl mx-auto">
              Featured projects showcasing my development expertise and creative problem-solving
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section className="py-20 relative z-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlowCard className="p-12" glowColor="#00ff41">
              <motion.div
                className="w-32 h-32 mx-auto mb-8 relative will-change-transform"
                whileHover={{
                  scale: 1.1,
                  rotateY: 180,
                  boxShadow: "0 0 40px rgba(0, 255, 65, 0.8)",
                }}
                transition={{ duration: 0.6 }}
                style={{ transform: "translateZ(0)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-cyan-500 rounded-lg p-0.5">
                  <div className="bg-black rounded-lg w-full h-full flex items-center justify-center">
                    <Download className="w-16 h-16 text-green-400" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-cyan-500 rounded-lg blur-lg opacity-50 -z-10" />
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-4 font-mono">resume.pdf</h2>
              <p className="text-xl text-gray-300 mb-8 font-mono">Download my complete professional profile</p>
              <motion.button
                className="code-button will-change-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ transform: "translateZ(0)" }}
              >
                <Download className="w-5 h-5 mr-2" />
                download_resume()
              </motion.button>
            </GlowCard>
          </motion.div>
        </div>
      </section>

      {/* Contact Section with Form */}
      <section id="contact" className="py-20 relative z-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-5xl font-bold mb-4 font-mono text-green-400 will-change-transform"
              style={{
                textShadow: "0 0 10px #00ff41",
                fontFamily: "'JetBrains Mono', monospace",
                transform: "translateZ(0)",
              }}
            >
              {"// contact"}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto mb-6" />
            <p className="text-xl text-gray-300 font-mono">Let's connect and build something amazing together</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <GlowCard className="p-8" glowColor="#0099ff">
                <h3 className="text-2xl font-bold text-white mb-6 font-mono">Get In Touch</h3>

                <div className="space-y-6">
                  {[
                    {
                      icon: Mail,
                      label: "EMAIL",
                      value: "Namanbagrecha007@gmail.com",
                      color: "#00ff41",
                    },
                    {
                      icon: Github,
                      label: "GITHUB",
                      value: "https://github.com/Namanjaina",
                      color: "#0099ff",
                    },
                    {
                      icon: Linkedin,
                      label: "LINKEDIN",
                      value: "www.linkedin.com/in/naman-bagrecha-860624259",
                      color: "#00ffff",
                    },
                  ].map((contact, index) => (
                    <motion.div
                      key={contact.label}
                      className="flex items-center space-x-4 group cursor-pointer will-change-transform"
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.3 }}
                      style={{ transform: "translateZ(0)" }}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-lg flex items-center justify-center border-2 backdrop-blur-sm will-change-transform"
                        style={{
                          borderColor: contact.color,
                          backgroundColor: `${contact.color}20`,
                          boxShadow: `0 0 15px ${contact.color}40`,
                          transform: "translateZ(0)",
                        }}
                        whileHover={{
                          boxShadow: `0 0 25px ${contact.color}80`,
                          rotate: 5,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <contact.icon className="w-6 h-6" style={{ color: contact.color }} />
                      </motion.div>
                      <div>
                        <p className="font-mono text-sm text-gray-400">{contact.label}</p>
                        <p className="font-mono text-white group-hover:text-green-400 transition-colors">
                          {contact.value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-black/50 rounded-lg border border-green-500/30">
                  <div className="font-mono text-sm">
                    <div className="text-green-400 mb-2">naman@terminal:~$ status</div>
                    <div className="text-cyan-400 mb-1">🟢 Available for new opportunities</div>
                    <div className="text-yellow-400 mb-1">📍 Location: Open to remote work</div>
                    <div className="text-blue-400 mb-2">⚡ Response time: Usually within 24 hours</div>
                    <div className="text-green-400">
                      naman@terminal:~$
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        className="will-change-opacity"
                      >
                        _
                      </motion.span>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <GlowCard className="p-8" glowColor="#00ff41">
                <h3 className="text-2xl font-bold text-white mb-6 font-mono">Send Message</h3>

                <form id="contact-form" action={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">{"// name"}</label>
                      <motion.input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white font-mono focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all will-change-transform"
                        placeholder="Enter your name"
                        whileFocus={{
                          boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)",
                        }}
                        style={{ transform: "translateZ(0)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">{"// email"}</label>
                      <motion.input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white font-mono focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all will-change-transform"
                        placeholder="your.email@example.com"
                        whileFocus={{
                          boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)",
                        }}
                        style={{ transform: "translateZ(0)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-mono text-green-400 mb-2">{"// subject"}</label>
                    <motion.input
                      type="text"
                      name="subject"
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white font-mono focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all will-change-transform"
                      placeholder="Project collaboration, job opportunity, etc."
                      whileFocus={{
                        boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)",
                      }}
                      style={{ transform: "translateZ(0)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mono text-green-400 mb-2">{"// message"}</label>
                    <motion.textarea
                      rows={6}
                      name="message"
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white font-mono focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all resize-none will-change-transform"
                      placeholder="Tell me about your project or opportunity..."
                      whileFocus={{
                        boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)",
                      }}
                      style={{ transform: "translateZ(0)" }}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <motion.button
                      type="submit"
                      disabled={formStatus.type === "loading"}
                      className="code-button flex-1 will-change-transform disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: formStatus.type === "loading" ? 1 : 1.02 }}
                      whileTap={{ scale: formStatus.type === "loading" ? 1 : 0.98 }}
                      style={{ transform: "translateZ(0)" }}
                    >
                      {formStatus.type === "loading" ? (
                        <>
                          <motion.div
                            className="w-5 h-5 mr-2 border-2 border-green-400 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          sending...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-5 h-5 mr-2" />
                          send_message()
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      type="reset"
                      className="code-button blue will-change-transform"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ transform: "translateZ(0)" }}
                    >
                      clear_form()
                    </motion.button>
                  </div>

                  {/* Form Status Display */}
                  {formStatus.type !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-3 rounded-lg border font-mono text-sm flex items-center ${
                        formStatus.type === "success"
                          ? "bg-green-500/10 border-green-500/30 text-green-400"
                          : formStatus.type === "error"
                            ? "bg-red-500/10 border-red-500/30 text-red-400"
                            : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      }`}
                    >
                      {formStatus.type === "success" && <CheckCircle className="w-4 h-4 mr-2" />}
                      {formStatus.type === "error" && <AlertCircle className="w-4 h-4 mr-2" />}
                      {formStatus.type === "loading" && (
                        <motion.div
                          className="w-4 h-4 mr-2 border-2 border-blue-400 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                      )}
                      {formStatus.message}
                    </motion.div>
                  )}

                  {/* Terminal-style form status */}
                  <div className="mt-4 p-3 bg-black/70 rounded-lg border border-green-500/20">
                    <div className="font-mono text-xs">
                      <span className="text-green-400">{">"} form.status: </span>
                      <span
                        className={`${
                          formStatus.type === "loading"
                            ? "text-yellow-400"
                            : formStatus.type === "success"
                              ? "text-green-400"
                              : formStatus.type === "error"
                                ? "text-red-400"
                                : "text-cyan-400"
                        }`}
                      >
                        {formStatus.type === "loading"
                          ? "sending_message..."
                          : formStatus.type === "success"
                            ? "message_sent_successfully"
                            : formStatus.type === "error"
                              ? "error_occurred"
                              : "ready_to_send"}
                      </span>
                    </div>
                  </div>
                </form>
              </GlowCard>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <GlowCard className="p-8 max-w-4xl mx-auto" glowColor="#00ffff">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white font-mono">Ready to Start Your Project?</h3>
                <p className="text-gray-300 font-mono leading-relaxed">
                  Whether you need a full-stack web application, a responsive frontend, or API development, I'm here to
                  bring your ideas to life with clean, efficient code and modern technologies.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <motion.button
                    className="code-button will-change-transform"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                    style={{ transform: "translateZ(0)" }}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    schedule_call()
                  </motion.button>
                  <motion.button
                    className="code-button blue will-change-transform"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    style={{ transform: "translateZ(0)" }}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    view_portfolio()
                  </motion.button>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 relative z-20 border-t border-green-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 font-mono mb-4">© 2025 Naman Bagrecha — Crafted with passion and precision</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
