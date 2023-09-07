import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';

export default function Home() {
  // const [toDo, setToDo] = useState<string[]>(() => {
  //   if (typeof window !== 'undefined') {
  //     const storedData = localStorage.getItem('toDos');
  //     return storedData ? JSON.parse(storedData) : [];
  //   }
  //   return [];
  // });
  const [toDo, setToDo] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [completed, setCompleted] = useState<string[]>([]);
  const [active, setActive] = useState<string[]>([]);
  const [filter, setFilter] = useState<
    'all' | 'active' | 'completed'
  >('all');
  const [renderedToDo, setRenderedToDo] = useState(toDo);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [render, setRender] = useState<0 | 1>(0)
  const [loading, setLoading] = useState(true)
  // localStorage.setItem('toDos', JSON.stringify(toDo));

  // useEffect(() => {
  //   const toDosJson = localStorage.getItem('toDos');
  //   if (toDosJson) {
  //     let toDos = JSON.parse(toDosJson);
  //     setToDo(toDos);
  //   }
  // }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToDo = localStorage.getItem('toDo');
      const storedActive = localStorage.getItem('active');
      const storedCompleted = localStorage.getItem('completed');
      console.log(`useEffect1 - ${storedToDo}`);
      if (storedToDo && storedActive && storedCompleted) {
        setToDo(JSON.parse(storedToDo));
        setActive(JSON.parse(storedActive));
        setCompleted(JSON.parse(storedCompleted));
        setRender(1)
      }
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text) return;
    if (toDo.includes(text)) return;

    const eventTarget = e.target as HTMLFormElement;
    eventTarget.children[0].className =
      ' w-full h-14 rounded-md pl-[54px] pt-[5px] focus:outline-none caret-bright-blue bg-white dark:bg-very-dark-desaturated-blue border-2 border-transparent transition duration-300 ease-in-out';

    setToDo([...toDo, text]);
    setActive([...active, text]);
    setText('');
    setRenderedToDo([...toDo, text]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && render == 1) {
      localStorage.setItem('toDo', JSON.stringify(toDo));
      localStorage.setItem('active', JSON.stringify(active));
      localStorage.setItem('completed', JSON.stringify(completed));
      console.log(`useEffect2 - ${toDo}`);
      setLoading(false)
      if (filter == 'all') {
        setRenderedToDo(toDo);
      } else if (filter == 'active') {
        setRenderedToDo(active)
      } else {
        setRenderedToDo(completed)
      }
    }
  }, [toDo, active, completed, render]);

  const deleteToDo = (index: number) => {
    setToDo((prevToDo) => {
      return prevToDo.filter((_, i) => i !== index);
    });

    setCompleted((prevToDo) => {
      return prevToDo.filter((_, i) => i !== index);
    });

    setActive((prevToDo) => {
      return prevToDo.filter((_, i) => i !== index);
    });

    setRenderedToDo((prevToDo) => {
      return prevToDo.filter((_, i) => i !== index);
    });
  };

  const checkToDo = (e: MouseEvent) => {
    const eventTarget = e.target as HTMLElement;
    const targetToDo = eventTarget.id;

    if (completed.includes(targetToDo)) {
      setCompleted(completed.filter((task) => task != targetToDo));
      setActive([...active, targetToDo]);
    } else {
      setCompleted([...completed, targetToDo]);
      setActive(active.filter((task) => task != targetToDo));
      console.log(completed);
    }
  };

  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);

  const handleSort = () => {
    let toDos = [...toDo];
    const draggedItemContent = toDos.splice(dragItem.current, 1)[0];
    toDos.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;

    setToDo(toDos);
    setCompleted(toDos.filter((task) => completed.includes(task)));
    setActive(toDos.filter((task) => active.includes(task)));
    setRenderedToDo(
      toDos.filter((task) => renderedToDo.includes(task))
    );
  };

  return (
    <div
      className={`h-full mb-10 ${
        theme == 'dark'
          ? 'dark bg-very-dark-blue text-light-grayish-blue'
          : 'bg-gray-100 text-gray-500'
      } font-josefin-sans relative flex flex-col items-center h-screen w-screen font-semibold`}
    >
      {theme == 'dark' ? (
        <img
          src="bg-desktop-dark.jpg"
          alt="background gradient mountains"
          className="absolute top-0 w-screen h-[270px]"
        />
      ) : (
        <img
          src="bg-desktop-light.jpg"
          alt="background gradient mountains"
          className="absolute top-0 w-screen h-[270px]"
        />
      )}

      <header className="flex justify-between items-center mb-8 w-[600px] z-10 mt-[60px] max-sm:w-[90%]">
        <h1 className="text-white font-bold text-[40px]">T O D O</h1>
        {theme == 'dark' ? (
          <img
            src="icon-sun.svg"
            alt="moon dark mode"
            className="h-6 hover:cursor-pointer"
            onClick={() => setTheme('light')}
          />
        ) : (
          <img
            src="icon-moon.svg"
            alt="moon dark mode"
            className="h-6 hover:cursor-pointer"
            onClick={() => setTheme('dark')}
          />
        )}
      </header>

      <main className="w-[600px] z-10 max-sm:w-[90%] max-[520px]:text-xs">
        <div className="flex relative">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="w-[600px]"
          >
            <input
              className=" w-full h-14 rounded-md pl-[54px] pt-[4px] text-base focus:outline-none caret-bright-blue bg-white dark:bg-very-dark-desaturated-blue transition duration-300 ease-in-out"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's next?"
            />
          </form>
          <p className="absolute top-4 left-5 border-2 border-light-grayish-blue-hover dark:border-very-dark-grayish-blue rounded-full w-6 h-6" />
        </div>
        <div>
          <ul className="bg-white dark:bg-very-dark-desaturated-blue mt-6 divide-solid divide-y-2 dark:divide-very-dark-grayish-blue shadow-md rounded-t-md overflow-hidden select-none">
            {loading == false && renderedToDo.length ? (
              renderedToDo.map((task, index) => (
                <li
                  key={task}
                  className={`group flex items-center justify-between py-4 px-5 dark:bg-very-dark-desaturated-blue ${
                    filter == 'all'
                      ? ' hover:cursor-grab active:cursor-grabbing'
                      : ''
                  }`}
                  draggable={filter == 'all' ? true : false}
                  onDragStart={(e) => {
                    dragItem.current = index;
                  }}
                  onDragEnter={(e) => {
                    dragOverItem.current = index;
                    e.dataTransfer.dropEffect = 'none';
                  }}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="flex gap-2">
                    <small
                      id={task}
                      className={`flex items-center justify-center rounded-full w-6 h-6 dark:border-very-dark-grayish-blue hover:cursor-pointer ${
                        completed.includes(task)
                          ? 'border-0 w-6 h-6 hover:cursor-pointer bg-gradient-to-b from-gradient-blue to-gradient-pink'
                          : 'border-2 hover:border-0 hover:bg-gradient-to-b from-gradient-blue to-gradient-pink'
                      }`}
                      onClick={(e) => {
                        checkToDo(e);
                      }}
                    >
                      <small
                        className={`pointer-events-none ${
                          completed.includes(task)
                            ? 'hidden'
                            : 'bg-white dark:bg-very-dark-desaturated-blue w-5 h-5 rounded-full'
                        }`}
                      />
                      <img
                        src="icon-check.svg"
                        alt="checkmark"
                        className={`${
                          completed.includes(task)
                            ? 'w-[10px] h-[10px] pointer-events-none fill-blue-500'
                            : 'hidden'
                        }`}
                      />
                    </small>
                    <p
                      className={`mt-[2px] text-base ${
                        completed.includes(task)
                          ? 'text-gray-300 line-through'
                          : ''
                      }`}
                    >
                      {task}
                    </p>
                  </div>
                  <img
                    src="icon-cross.svg"
                    alt="delete"
                    className="sm:hidden max-sm:w-3 max-sm:h-3 group-hover:block hover:cursor-pointer w-5 h-5"
                    id={task}
                    onClick={() => {
                      deleteToDo(index);
                    }}
                  />
                </li>
              ))
            ) : (
              <li className="relative flex items-center justify-center py-[14px] text-[20px]">
                <p className="z-10">
                  {toDo.length == 0
                    ? 'Nothing to do?'
                    : 'Not finished yet?'}
                </p>
              </li>
            )}
          </ul>

          <div className="flex justify-between bg-white text-gray-400 dark:bg-very-dark-desaturated-blue dark:text-very-dark-grayish-blue py-3 px-5 font-semibold rounded-b-md border-t-2 dark:border-t-very-dark-grayish-blue shadow-md">
            <p>{toDo.length - completed.length} item(s) left</p>
            <div className=" max-sm:hidden flex gap-3 max-[520px]:gap-1">
              <p
                className={`hover:cursor-pointer hover:text-black dark:hover:text-light-grayish-blue transition duration-150 ease-in-out ${
                  filter == 'all' ? 'text-bright-blue' : ''
                }`}
                onClick={() => {
                  setFilter('all');
                  setRenderedToDo(toDo);
                }}
              >
                All
              </p>
              <p
                className={`hover:cursor-pointer hover:text-black dark:hover:text-light-grayish-blue transition duration-150 ease-in-out ${
                  filter == 'active' ? 'text-bright-blue' : ''
                }`}
                onClick={() => {
                  setFilter('active');
                  setRenderedToDo(active);
                }}
              >
                Active
              </p>

              <p
                className={`hover:cursor-pointer hover:text-black dark:hover:text-light-grayish-blue transition duration-150 ease-in-out ${
                  filter == 'completed' ? 'text-bright-blue' : ''
                }`}
                onClick={(e) => {
                  setFilter('completed');
                  setRenderedToDo(completed);
                }}
              >
                Completed
              </p>
            </div>
            <p
              className="hover:cursor-pointer hover:text-black dark:hover:text-light-grayish-blue transition duration-150 ease-in-out"
              onClick={() => {
                setToDo(
                  toDo.filter((task) => !completed.includes(task))
                );
                setCompleted([]);
                setRenderedToDo(
                  renderedToDo.filter(
                    (task) => !completed.includes(task)
                  )
                );
              }}
            >
              Clear Completed
            </p>
          </div>

          <div className="sm:hidden mt-5 flex justify-center bg-white text-gray-400 dark:bg-very-dark-desaturated-blue dark:text-very-dark-grayish-blue py-4 px-5 font-semibold rounded-md shadow-sm">
            <div className="flex text-base gap-4">
              <p
                className={`hover:cursor-pointer transition duration-150 ease-in-out ${
                  filter == 'all' ? ' text-bright-blue' : ''
                }`}
                onClick={() => {
                  setFilter('all');
                  setRenderedToDo(toDo);
                }}
              >
                All
              </p>
              <p
                className={`hover:cursor-pointer transition duration-150 ease-in-out ${
                  filter == 'active' ? 'text-bright-blue' : ''
                }`}
                onClick={() => {
                  setFilter('active');
                  setRenderedToDo(active);
                }}
              >
                Active
              </p>

              <p
                className={`hover:cursor-pointer transition duration-150 ease-in-out ${
                  filter == 'completed' ? 'text-bright-blue' : ''
                }`}
                onClick={(e) => {
                  setFilter('completed');
                  setRenderedToDo(completed);
                }}
              >
                Completed
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
