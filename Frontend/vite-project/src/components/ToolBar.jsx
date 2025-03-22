import { React, useContext} from "react";
import { CirclePlus, Trash, Pencil, Palette } from 'lucide-react';
import { MindmapContext } from "/src/components/Context";

export default function TooolBar({addNode, deleteNode}) {
  //Global States
  const {selectedNode, setSelectedNode} = useContext(MindmapContext);

  function handleAddNode() {
    if (selectedNode) {
      console.log(selectedNode);
      addNode(selectedNode);
    } else {
      console.log('No Node selected');
    }
  }
  function handleDeleteNode() {
    if (selectedNode) {
      deleteNode();
    } else {
      console.log('No Node selected');
    }
  }

    return(
        <div className="absolute top-1 left-1  z-10 bg-neutral-200 dark:bg-neutral-800 text-white p-1 rounded flex space-x-2">
          <button className='rounded transition-all hover:bg-neutral-200 dark:hover:bg-neutral-700 active:bg-neutral-300 dark:active:bg-neutral-600 hover:cursor-pointer'
                  onClick={handleAddNode}
                  disabled={!selectedNode}
          >
            <CirclePlus className='text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'/>
          </button>
          <button className='rounded transition-all hover:bg-neutral-200 dark:hover:bg-neutral-700 active:bg-neutral-300 dark:active:bg-neutral-600 hover:cursor-pointer'
                  onClick={handleDeleteNode}
                  disabled={!selectedNode}
          >
            <Trash className='text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'/>
          </button>
          <button className='rounded transition-all hover:bg-neutral-200 dark:hover:bg-neutral-700 active:bg-neutral-300 dark:active:bg-neutral-600 hover:cursor-pointer'>
            <Pencil className='text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'/>
          </button>
          <button className='rounded transition-all hover:bg-neutral-200 dark:hover:bg-neutral-700 active:bg-neutral-300 dark:active:bg-neutral-600 hover:cursor-pointer'>
            <Palette className='text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'/>
          </button>
        </div>
    )
}