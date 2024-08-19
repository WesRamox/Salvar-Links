import { AlignLeft, HeartCrackIcon, Link2, NavigationIcon, Save, SquarePen, Tag, Trash2, X } from "lucide-react"
import { useState } from "react"
import Favicon from "./assets/favicon.png"
import AlertBox from "./components/alertBox/AlertBox"

interface linkType {
  id: number,
  createdAt: string,
  url: string,
  favicon: string,
  name: string
}

const App = () => {
  const [links, setLinks] = useState<linkType[]>(() => {
    const linksSalvos = localStorage.getItem("LINKS-DB")
    if(!linksSalvos) return []
      const items = JSON.parse(linksSalvos)
      return items
  })
  const [linkUrl, setLinkUrl] = useState("")
  const [success, setSuccess] = useState(false)
  const [linkName, setLinkName] = useState("")
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const addLinkToStorage = () => {
    function dataAtualFormatada() {
      const data = new Date(),
          dia  = data.getDate().toString(),
          diaF = (dia.length == 1) ? '0'+dia : dia,
          mes  = (data.getMonth()+1).toString(),
          mesF = (mes.length == 1) ? '0'+mes : mes,
          anoF = data.getFullYear();
      return diaF+"/"+mesF+"/"+anoF;
    }
    
    const linkToAdd = {
      id: Math.floor(Math.random() * 1000),
      createdAt: dataAtualFormatada(),
      url: linkUrl,
      favicon: `http://www.google.com/s2/favicons?domain=${linkUrl}`,
      name: linkName
    }

    if(linkToAdd.name != "" && linkToAdd.url != "") {
      setLinks((currentState: linkType[]) => {
        const updatedList = [linkToAdd, ...currentState]
        localStorage.setItem("LINKS-DB", JSON.stringify(updatedList))
        return updatedList
      })
      
      setSuccess(true)
      resetInputs()

      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } else {
      alert("Digite um nome e uma url!")
    }
  }

  const deleteLink = (id: number) => {
    setLinks(state => {
      const newState = state.filter(link => link.id !== id)
      localStorage.setItem("LINKS-DB", JSON.stringify(newState))
      return newState
    })
  }

  const resetInputs = () => {
    setLinkUrl("")
    setLinkName("")
  }

  const copyToClipBoardLink = (linkUrl: string) => {
    navigator.clipboard.writeText(linkUrl);
  }

  const handleOpenModal = () => {
    setModalIsOpen(!modalIsOpen)
  }
  

  const handleSubmit = () => {
    addLinkToStorage()
  }
  

  return(
    <div className="flex items-center bg-zinc-900 text-slate-100 w-screen h-screen cursor-default">
      <div className="left bg-[url('./assets/bg.jpg')] bg-cover bg-center w-1/2 h-full flex flex-col justify-center bg-no-repeat items-center gap-2">
        <h1 className="text-3xl text-center font-semibold bg-zinc-900 w-fit px-4 bg-opacity-80 rounded">Seja bem vindo ao <span className="text-purple-600">Link</span> Saver.</h1>
        <h2 className="text-xl text-zinc-700 text-center font-semibold">Salve seus links importantes aqui</h2>
      </div>

      <div className="right flex flex-col items-center h-full justify-center w-full">
        <h1 className="font-semibold text-5xl"><span className="text-purple-500">Link</span> Saver.</h1>
        <div className="p-10 mt-10 flex flex-col gap-5 rounded w-1/2">
          <div className="flex flex-col justify-between gap-2">
            <h2 className="flex gap-2 items-center"><Tag size={22}/> Nome </h2>
            <input 
              className="text-white h-10 rounded bg-neutral-800 border-none px-2" 
              type="text" id="input-link" 
              placeholder="Aula da faculdade" 
              value={linkName}
              onChange={(ev) => {
                setLinkName(ev.currentTarget.value)
              }}  
            />
            <h2 className="flex gap-2 items-center"><Link2 size={22} /> Endereço / URL </h2>
            <input 
              className="text-white h-10 rounded bg-neutral-800 border-none px-2" 
              type="text" id="input-link" 
              placeholder="Ex: https://seulink.com" 
              value={linkUrl}
              onChange={(ev) => {
                setLinkUrl(ev.currentTarget.value)
              }}  
            />
            <button 
              className="w-full bg-purple-600 flex hover:text-purple-200 justify-center items-center gap-2"
              onClick={handleSubmit}>Salvar Link <Save size={20}/></button>
          </div>
          <div className="flex gap-3 w-full">
            <button 
              className="w-full bg-purple-200 text-zinc-700 hover:text-purple-500 flex justify-center items-center gap-2">
              Editar Links <SquarePen size={20} />
            </button>
            <button 
              className="w-full bg-purple-200 text-zinc-700 hover:text-purple-500 flex justify-center items-center gap-2"
              onClick={handleOpenModal}
            >
              Ver Links <AlignLeft size={20} />
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center">
            {links.map(link => (
              <div className="flex flex-col justify-center items-center m-2">
                <p className="truncate w-20">{link.name}</p>
                <a href={link.url} target="_blank" title={link.name}>
                  <img className="w-6" src={link.favicon} alt={link.name} />
                </a>
              </div>
            ))}
        </div>
      </div>
      {success && (
        <AlertBox />
      )}
      {modalIsOpen && (
        <section className="absolute w-full h-full bg-black bg-opacity-80 flex justify-center items-center flex-col">
          <button 
            className="absolute right-0 top-0"
            onClick={handleOpenModal}  
          >
            <X size={40}/>
          </button>
          <div className="flex flex-col justify-center items-center gap-2 mb-10">
            <h1 className="font-semibold text-5xl"><span className="text-purple-500">Link</span> Saver.</h1>
            <h2 className="text-xl font-normal text-zinc-400">Seus links salvos</h2>
          </div>
          <div className="flex flex-col bg-purple-950 rounded p-10 gap-3">
          {links.length <= 0 && (
            <h2 className="text-2xl flex items-center gap-2">Nenhum link salvo <HeartCrackIcon /></h2>
          )}
            {links.map(link => (
              <div className="flex gap-3 h-10 justify-center items-center m-2" key={link.id}>
                <div className="flex items-center justify-center rounded bg-purple-800 p-1">
                  <img 
                    className="w-6"
                    src={link.favicon ? link.favicon : Favicon}
                    />
                </div>
                <div className="flex flex-col items-center">
                  <h2 className="text-gray-400">ID</h2>
                  <p>{link.id}</p>
                </div>
                <div className="flex flex-col w-32">
                  <h2 className="text-gray-400">NOME</h2>
                  <a href={link.url}
                    className="w-32 truncate text-white hover:text-purple-400"
                    title={link.name}>{link.name}
                  </a>
                </div>
                <div className="flex flex-col w-24">
                  <h2 className="text-gray-400">Criado em:</h2>
                  <p>{link.createdAt}</p>
                </div>
                <a 
                  href={link.url}
                  target="_blank" 
                  className="text-white hover:text-purple-400">
                    <NavigationIcon size={20} />
                </a>
                <button 
                  className="bg-transparent p-0 hover:text-gray-300"
                  onClick={() => {
                    copyToClipBoardLink(link.url)
                  }}
                  title={"Copiar " + link.url}
                >
                  <Link2 size={20}/>
                </button>
                <button 
                  className="bg-transparent p-0 hover:text-gray-300"
                  onClick={() => {
                    deleteLink(link.id)}
                  }  
                  title={"Deletar " + link.url}
                >
                  <Trash2 size={20}/>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
        
    </div>
  )
}

export default App