import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, Wand2, Download } from 'lucide-react'
import { Blob } from '@/components/Blob'

const steps = [
  { icon: Upload, title: 'Envie sua foto', desc: 'Faça upload de uma foto com a pessoa em pé, corpo inteiro visível.' },
  { icon: Wand2, title: 'Escolha o movimento', desc: 'Envie um vídeo de referência com o movimento desejado.' },
  { icon: Download, title: 'Receba o vídeo', desc: 'Baixe o vídeo da pessoa da foto executando o movimento.' },
]

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <Blob color="purple" position="top-left" size="lg" />
      <Blob color="cyan" position="top-right" size="md" delay="7s" />
      <Blob color="pink" position="bottom-left" size="md" delay="14s" />

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-28 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
        >
          Transforme qualquer foto em{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            vídeo de dança
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-text-secondary text-lg max-w-2xl mx-auto"
        >
          Envie uma foto de alguém + um vídeo de referência com movimento, e nossa IA gera um vídeo realista da pessoa executando aquele movimento.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10"
        >
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-colors shadow-[0_0_40px_rgba(168,85,247,0.3)]"
          >
            <Wand2 className="w-5 h-5" />
            Começar agora
          </Link>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-28">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-12"
        >
          Como funciona
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-surface border border-border rounded-2xl p-6 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-text-secondary">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Examples placeholder */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-28">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-12"
        >
          Exemplos
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {['Foto input', 'Vídeo referência', 'Resultado'].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
              className="bg-surface border border-border rounded-2xl aspect-video flex items-center justify-center"
            >
              <span className="text-text-muted text-sm">{label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center">
        <p className="text-text-muted text-sm">
          MotionClone — Powered by AI
        </p>
      </footer>
    </div>
  )
}
