import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import LanguagesHeader from './components/LanguagesHeader'
import LanguageGrid from './components/LanguageGrid'
import DetailPanel from './components/DetailPanel'
import ResourcesView from './components/ResourcesView'
import ConceptsView from './components/ConceptsView'
import ComponentsView from './components/ComponentsView'
import ComponentDetail from './components/ComponentDetail'
import SkillsView from './components/SkillsView'
import ConsejosView from './components/ConsejosView'
import SkillDetail from './components/SkillDetail'
import LandingView from './components/LandingView'
import CompareTray from './components/CompareTray'
import CompareModal from './components/CompareModal'
import Quiz from './components/Quiz'
import { LANGUAGES, CATEGORIES, matchesFilter } from './data/languages'
import { RESOURCES } from './data/resources'
import { CONCEPTS } from './data/concepts'
import { COMPONENT_GROUPS, COMPONENT_ITEMS } from './data/components'
import { SKILL_GROUPS, SKILL_ITEMS } from './data/skills'
import { CONSEJO_GRUPOS, CONSEJOS } from './data/consejos'
import { I18N } from './data/i18n'

function useFavorites() {
  const [set, setSet] = useState(() => new Set())
  const toggle = (key) =>
    setSet((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  return [set, toggle]
}

// Aportar pasa por el repositorio: los consejos viven en un archivo, como el
// resto del catálogo. Quién puede hacerlo se decide al revisar la pull request.
const URL_APORTAR = 'https://github.com/Mun1to/Vibeset/blob/main/redesign/src/data/consejos.js'

const IDIOMAS = ['es', 'en']
const CLAVE_IDIOMA = 'vibeset-lang'

// El idioma se auto-selecciona, no se fuerza: manda lo que el visitante haya
// elegido antes; si nunca eligió, el del navegador; y si tampoco encaja,
// español. Solo se guarda la elección hecha a mano, así que a quien no ha
// tocado el botón la web le sigue el idioma del navegador si lo cambia.
function idiomaInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE_IDIOMA)
    if (IDIOMAS.includes(guardado)) return guardado
  } catch { /* navegación privada sin almacenamiento */ }

  const preferidos = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const etiqueta of preferidos ?? []) {
    // 'en-GB' y 'en' valen los dos: interesa la parte de antes del guion.
    const base = String(etiqueta).toLowerCase().split('-')[0]
    if (IDIOMAS.includes(base)) return base
  }
  return 'es'
}

export default function App() {
  const [lang, setLang] = useState(idiomaInicial)
  const [activeNav, setActiveNav] = useState('home')
  const t = I18N[lang]

  const cambiarIdioma = () =>
    setLang((anterior) => {
      const nuevo = anterior === 'es' ? 'en' : 'es'
      try { localStorage.setItem(CLAVE_IDIOMA, nuevo) } catch { /* sin almacenamiento */ }
      return nuevo
    })

  // El idioma declarado en el html tiene que seguir al que se está leyendo:
  // es lo que usan los lectores de pantalla y los traductores del navegador.
  useEffect(() => { document.documentElement.lang = lang }, [lang])

  const [filter, setFilter] = useState({ type: 'all' })
  const [query, setQuery] = useState('')
  const [langFavs, toggleLangFav] = useFavorites()
  const [compareSet, setCompareSet] = useState(() => [])
  const [langFavOnly, setLangFavOnly] = useState(false)
  const [selected, setSelected] = useState('Python')
  const [quizOpen, setQuizOpen] = useState(false)
  const [cmpOpen, setCmpOpen] = useState(false)

  const [resQuery, setResQuery] = useState(''); const [resCat, setResCat] = useState('all')
  const [resFavs, toggleResFav] = useFavorites(); const [resFavOnly, setResFavOnly] = useState(false)
  const [conQuery, setConQuery] = useState(''); const [conCat, setConCat] = useState('all')
  const [conFavs, toggleConFav] = useFavorites(); const [conFavOnly, setConFavOnly] = useState(false)
  const [compQuery, setCompQuery] = useState(''); const [compCat, setCompCat] = useState('all')
  const [compFavs, toggleCompFav] = useFavorites(); const [compFavOnly, setCompFavOnly] = useState(false)
  const [skiQuery, setSkiQuery] = useState(''); const [skiCat, setSkiCat] = useState('all')
  const [skiFavs, toggleSkiFav] = useFavorites(); const [skiFavOnly, setSkiFavOnly] = useState(false)
  const [openSkill, setOpenSkill] = useState(null)
  const [cjQuery, setCjQuery] = useState(''); const [cjCat, setCjCat] = useState('all')
  const [cjFavs, toggleCjFav] = useFavorites(); const [cjFavOnly, setCjFavOnly] = useState(false)
  // El muro sale mezclado y se puede volver a mezclar: el orden del archivo no
  // dice nada, y así no salen siempre los mismos arriba.
  const [cjSemilla, setCjSemilla] = useState(() => Math.random())

  // Ficha abierta y ajustes de cada componente: viven aquí para que no se
  // pierdan al cambiar de sección y volver.
  const [openComp, setOpenComp] = useState(null)
  const [compValues, setCompValues] = useState(() =>
    Object.fromEntries(COMPONENT_ITEMS.map((c) => [c.key, { ...c.defaults }])))
  const setCompValue = (key, prop, value) =>
    setCompValues((prev) => ({ ...prev, [key]: { ...prev[key], [prop]: value } }))
  const resetComp = (key) =>
    setCompValues((prev) => ({ ...prev, [key]: { ...COMPONENT_ITEMS.find((c) => c.key === key).defaults } }))

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LANGUAGES.filter((l) => {
      if (langFavOnly && !langFavs.has(l.name)) return false
      if (!matchesFilter(l, filter)) return false
      if (!q) return true
      const d = l[lang]
      const hay = [l.name, l.creator, d.desc, d.fullDesc, d.paradigm, ...d.uses, ...l.extensions, ...l.eco]
        .join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [filter, query, langFavOnly, langFavs, lang])

  const resGroups = useMemo(() => {
    const q = resQuery.trim().toLowerCase()
    return RESOURCES.filter((g) => resCat === 'all' || g.key === resCat)
      .map((g) => ({ ...g, items: g.items.filter((r) => {
        if (resFavOnly && !resFavs.has(r.name)) return false
        return !q || r.name.toLowerCase().includes(q) || r[lang].toLowerCase().includes(q)
      })}))
      .filter((g) => g.items.length > 0)
  }, [resQuery, resCat, lang, resFavOnly, resFavs])

  const conGroups = useMemo(() => {
    const q = conQuery.trim().toLowerCase()
    return CONCEPTS.filter((g) => conCat === 'all' || g.key === conCat)
      .map((g) => ({ ...g, items: g.items.filter((c) => {
        if (conFavOnly && !conFavs.has(c.name)) return false
        return !q || [c.name, c.nameEn ?? '', c[lang].what].join(' ').toLowerCase().includes(q)
      })}))
      .filter((g) => g.items.length > 0)
  }, [conQuery, conCat, lang, conFavOnly, conFavs])

  const compItems = useMemo(() => {
    const q = compQuery.trim().toLowerCase()
    return COMPONENT_ITEMS.filter((c) => {
      if (compFavOnly && !compFavs.has(c.key)) return false
      if (compCat !== 'all' && c.group !== compCat) return false
      return !q || c.name.toLowerCase().includes(q)
    })
  }, [compQuery, compCat, compFavOnly, compFavs])

  // Mezcla estable: con la misma semilla sale el mismo orden, así que filtrar o
  // marcar un favorito no reordena el muro entero bajo el dedo.
  const cjLista = useMemo(() => {
    const q = cjQuery.trim().toLowerCase()
    const filtrados = CONSEJOS.filter((c) => {
      if (cjFavOnly && !cjFavs.has(c.id)) return false
      if (cjCat !== 'all' && c.grupo !== cjCat) return false
      return !q || [c.es, c.en, c.autor ?? ''].join(' ').toLowerCase().includes(q)
    })
    const peso = (id) => {
      let h = 0
      const cadena = id + cjSemilla
      for (let i = 0; i < cadena.length; i++) h = (h * 31 + cadena.charCodeAt(i)) % 100000
      return h
    }
    return filtrados.sort((a, b) => peso(a.id) - peso(b.id))
  }, [cjQuery, cjCat, cjFavOnly, cjFavs, cjSemilla])

  // Las skills se muestran agrupadas por categoría, como los conceptos.
  const skiGroups = useMemo(() => {
    const q = skiQuery.trim().toLowerCase()
    return SKILL_GROUPS.filter((g) => skiCat === 'all' || g.key === skiCat)
      .map((g) => ({ ...g, items: SKILL_ITEMS.filter((s) => {
        if (s.group !== g.key) return false
        if (skiFavOnly && !skiFavs.has(s.key)) return false
        const d = s[lang]
        return !q || [s.name, s.nameEn, d.label, d.what, d.when].join(' ').toLowerCase().includes(q)
      })}))
      .filter((g) => g.items.length > 0)
  }, [skiQuery, skiCat, lang, skiFavOnly, skiFavs])

  const toggleCompare = (name) =>
    setCompareSet((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : prev.length >= 3 ? prev : [...prev, name])

  const sidebarProps = useMemo(() => {
    if (activeNav === 'languages') {
      const activeCat = filter.type === 'cat' ? filter.value : filter.type === 'all' ? 'all' : null
      return {
        searchPh: t.searchPh, query, setQuery,
        categories: CATEGORIES.map((c) => ({ key: c.key, label: c.label[lang], count: c.count, dot: c.dot })),
        activeCat: langFavOnly ? null : activeCat,
        setActiveCat: (k) => { setFilter(k === 'all' ? { type: 'all' } : { type: 'cat', value: k }); setLangFavOnly(false) },
        extraGroup: {
          showFavOnly: langFavOnly, onToggleFavOnly: () => setLangFavOnly((v) => !v),
          favCount: langFavs.size, compareCount: compareSet.length,
        },
      }
    }
    if (activeNav === 'resources') {
      return {
        searchPh: t.searchPh, query: resQuery, setQuery: setResQuery,
        categories: [{ key: 'all', label: t.all, count: RESOURCES.reduce((n, g) => n + g.items.length, 0), dot: '#818cf8' },
          ...RESOURCES.map((g) => ({ key: g.key, label: g.label[lang], count: g.items.length, dot: g.dot }))],
        activeCat: resFavOnly ? null : resCat,
        setActiveCat: (k) => { setResCat(k); setResFavOnly(false) },
        extraGroup: { showFavOnly: resFavOnly, onToggleFavOnly: () => setResFavOnly((v) => !v), favCount: resFavs.size },
      }
    }
    if (activeNav === 'concepts') {
      return {
        searchPh: t.searchPh, query: conQuery, setQuery: setConQuery,
        categories: [{ key: 'all', label: t.all, count: CONCEPTS.reduce((n, g) => n + g.items.length, 0), dot: '#818cf8' },
          ...CONCEPTS.map((g) => ({ key: g.key, label: g.label[lang], count: g.items.length, dot: g.color }))],
        activeCat: conFavOnly ? null : conCat,
        setActiveCat: (k) => { setConCat(k); setConFavOnly(false) },
        extraGroup: { showFavOnly: conFavOnly, onToggleFavOnly: () => setConFavOnly((v) => !v), favCount: conFavs.size },
      }
    }
    if (activeNav === 'skills') {
      return {
        searchPh: t.searchPh, query: skiQuery,
        setQuery: (v) => { setSkiQuery(v); setOpenSkill(null) },
        categories: [{ key: 'all', label: t.all, count: SKILL_ITEMS.length },
          ...SKILL_GROUPS.map((g) => ({ key: g.key, label: g.label[lang],
            count: SKILL_ITEMS.filter((s) => s.group === g.key).length }))],
        activeCat: skiFavOnly ? null : skiCat,
        setActiveCat: (k) => { setSkiCat(k); setSkiFavOnly(false); setOpenSkill(null) },
        extraGroup: { showFavOnly: skiFavOnly,
          onToggleFavOnly: () => { setSkiFavOnly((v) => !v); setOpenSkill(null) }, favCount: skiFavs.size },
      }
    }
    if (activeNav === 'consejos') {
      return {
        searchPh: t.consejosPh, query: cjQuery, setQuery: setCjQuery,
        categories: [{ key: 'all', label: t.all, count: CONSEJOS.length },
          ...CONSEJO_GRUPOS.map((g) => ({ key: g.key, label: g.label[lang],
            count: CONSEJOS.filter((c) => c.grupo === g.key).length }))],
        activeCat: cjFavOnly ? null : cjCat,
        setActiveCat: (k) => { setCjCat(k); setCjFavOnly(false) },
        extraGroup: { showFavOnly: cjFavOnly, onToggleFavOnly: () => setCjFavOnly((v) => !v), favCount: cjFavs.size },
      }
    }
    return {
      searchPh: t.searchPh, query: compQuery,
      setQuery: (v) => { setCompQuery(v); setOpenComp(null) },
      categories: [{ key: 'all', label: t.all, count: COMPONENT_ITEMS.length },
        ...COMPONENT_GROUPS.map((g) => ({ key: g.key, label: g.label[lang],
          count: COMPONENT_ITEMS.filter((c) => c.group === g.key).length }))],
      activeCat: compFavOnly ? null : compCat,
      setActiveCat: (k) => { setCompCat(k); setCompFavOnly(false); setOpenComp(null) },
      extraGroup: { showFavOnly: compFavOnly, onToggleFavOnly: () => { setCompFavOnly((v) => !v); setOpenComp(null) }, favCount: compFavs.size },
    }
  }, [activeNav, t, lang, query, filter, langFavOnly, langFavs, compareSet,
      resQuery, resCat, resFavOnly, resFavs, conQuery, conCat, conFavOnly, conFavs,
      compQuery, compCat, compFavOnly, compFavs, skiQuery, skiCat, skiFavOnly, skiFavs,
      cjQuery, cjCat, cjFavOnly, cjFavs])

  // El logo devuelve al inicio limpio, sin recargar: se conservan favoritos y comparación.
  const goHome = () => {
    setActiveNav('home'); setFilter({ type: 'all' }); setQuery(''); setLangFavOnly(false); setSelected('Python')
    setOpenComp(null); setOpenSkill(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const navigate = (key) => {
    if (key === 'components') setOpenComp(null)
    if (key === 'skills') setOpenSkill(null)
    setActiveNav(key)
  }
  const openLanguage = (name) => {
    setActiveNav('languages'); setSelected(name); setFilter({ type: 'all' }); setQuery(''); setLangFavOnly(false)
    requestAnimationFrame(() => document.getElementById('grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  // Un resultado del buscador deja la cosa abierta, no solo la sección: la ficha
  // del lenguaje, la del componente o la de la skill. Los recursos son enlaces a
  // sitios de fuera, así que se abren igual que en su propia sección.
  const abrirResultado = (r) => {
    if (r.seccion === 'languages') return openLanguage(r.clave)
    if (r.seccion === 'resources') return window.open(r.url, '_blank', 'noopener')

    window.scrollTo({ top: 0 })
    if (r.seccion === 'concepts') { setActiveNav('concepts'); setConCat('all'); setConFavOnly(false); setConQuery(r.clave) }
    else if (r.seccion === 'components') { setActiveNav('components'); setOpenComp(r.clave) }
    else if (r.seccion === 'skills') { setActiveNav('skills'); setOpenSkill(r.clave) }
    else if (r.seccion === 'consejos') {
      // El consejo no tiene ficha propia: se deja el muro con ese solo a la vista.
      setActiveNav('consejos'); setCjCat('all'); setCjFavOnly(false)
      setCjQuery(CONSEJOS.find((c) => c.id === r.clave)?.[lang]?.replace(/[*`]/g, '') ?? '')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <TopBar
        t={t} lang={lang} onToggleLang={cambiarIdioma} activeNav={activeNav} setActiveNav={navigate}
        onLogoClick={goHome}
        onAbrirResultado={abrirResultado}
        onQuizClick={() => setQuizOpen(true)}
      />
      <div className="flex">
        {activeNav !== 'home' && <Sidebar t={t} {...sidebarProps} />}
        <main className="flex-1 min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={
                activeNav === 'components' && openComp ? `comp-${openComp}`
                : activeNav === 'skills' && openSkill ? `skill-${openSkill}`
                : activeNav
              }
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeNav === 'home' && (
                <LandingView
                  t={t} lang={lang}
                  totals={{ langs: LANGUAGES.length, res: RESOURCES.reduce((n, g) => n + g.items.length, 0),
                            concepts: CONCEPTS.reduce((n, g) => n + g.items.length, 0), comps: COMPONENT_ITEMS.length,
                            skills: SKILL_ITEMS.length, consejos: CONSEJOS.length }}
                  onNavigate={(k) => { navigate(k); window.scrollTo({ top: 0 }) }}
                  onQuiz={() => setQuizOpen(true)}
                />
              )}
              {activeNav === 'languages' && (
                <>
                  <LanguagesHeader t={t} lang={lang} filter={filter} setFilter={setFilter}
                                   total={LANGUAGES.length} shown={visible.length} />
                  <LanguageGrid
                    t={t} lang={lang} list={visible} total={LANGUAGES.length}
                    selected={selected} onSelect={setSelected}
                    favorites={langFavs} onToggleFav={toggleLangFav}
                    compareSet={new Set(compareSet)} onToggleCompare={toggleCompare}
                    onClearFilters={() => { setFilter({ type: 'all' }); setQuery(''); setLangFavOnly(false) }}
                  />
                  {visible.some((l) => l.name === selected) && <DetailPanel t={t} lang={lang} selected={selected} />}
                </>
              )}
              {activeNav === 'resources' && (
                <ResourcesView t={t} lang={lang} groups={resGroups} favorites={resFavs} onToggleFav={toggleResFav}
                  onClear={() => { setResQuery(''); setResCat('all'); setResFavOnly(false) }} />
              )}
              {activeNav === 'concepts' && (
                <ConceptsView t={t} lang={lang} groups={conGroups} favorites={conFavs} onToggleFav={toggleConFav}
                  onClear={() => { setConQuery(''); setConCat('all'); setConFavOnly(false) }} />
              )}
              {activeNav === 'components' && (
                openComp ? (
                  <ComponentDetail
                    t={t} lang={lang}
                    item={COMPONENT_ITEMS.find((c) => c.key === openComp)}
                    values={compValues[openComp]}
                    onChange={(prop, value) => setCompValue(openComp, prop, value)}
                    onReset={() => resetComp(openComp)}
                    onBack={() => setOpenComp(null)}
                    fav={compFavs.has(openComp)}
                    onToggleFav={() => toggleCompFav(openComp)}
                  />
                ) : (
                  <ComponentsView t={t} lang={lang} items={compItems} favorites={compFavs} onToggleFav={toggleCompFav}
                    values={compValues}
                    onOpen={(key) => { setOpenComp(key); window.scrollTo({ top: 0 }) }}
                    onClear={() => { setCompQuery(''); setCompCat('all'); setCompFavOnly(false) }} />
                )
              )}
              {activeNav === 'skills' && (
                openSkill ? (
                  <SkillDetail
                    t={t} lang={lang}
                    item={SKILL_ITEMS.find((s) => s.key === openSkill)}
                    group={SKILL_GROUPS.find((g) => g.key === SKILL_ITEMS.find((s) => s.key === openSkill).group)}
                    onBack={() => setOpenSkill(null)}
                    fav={skiFavs.has(openSkill)}
                    onToggleFav={() => toggleSkiFav(openSkill)}
                  />
                ) : (
                  <SkillsView t={t} lang={lang} groups={skiGroups} favorites={skiFavs} onToggleFav={toggleSkiFav}
                    onOpen={(key) => { setOpenSkill(key); window.scrollTo({ top: 0 }) }}
                    onClear={() => { setSkiQuery(''); setSkiCat('all'); setSkiFavOnly(false) }} />
                )
              )}
              {activeNav === 'consejos' && (
                <ConsejosView
                  t={t} lang={lang} lista={cjLista} total={CONSEJOS.length}
                  favorites={cjFavs} onToggleFav={toggleCjFav}
                  onMezclar={() => setCjSemilla(Math.random())}
                  urlAportar={URL_APORTAR}
                  onClear={() => { setCjQuery(''); setCjCat('all'); setCjFavOnly(false) }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CompareTray t={t} names={compareSet} onRemove={toggleCompare}
        onClear={() => setCompareSet([])} onOpen={() => setCmpOpen(true)} />
      <CompareModal t={t} lang={lang} open={cmpOpen} onClose={() => setCmpOpen(false)} names={compareSet} />
      <Quiz t={t} lang={lang} open={quizOpen} onClose={() => setQuizOpen(false)} onSeeLanguage={openLanguage} />
    </div>
  )
}
