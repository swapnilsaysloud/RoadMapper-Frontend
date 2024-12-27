import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import Popup from './Popup';
import { generateNodes, generateEdges } from './graphUtils';


const backendapi = "https://roadmapper-backend.onrender.com" ; 

const nodeTypes = {
  custom: CustomNode,
};

const Graph = ({ data }) => {
  console.log(data);
  const contentRef = useRef('') ;
  const [nodes, setNodes, onNodesChange] = useNodesState(generateNodes(data));
  const [edges, setEdges, onEdgesChange] = useEdgesState(generateEdges(data));
  const [popupData, setPopupData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const expandNode = useCallback(async (node) => {
    // If the node is already open, just show the popup with existing content
    if (node.data.content.length > 200) {
        node.data.isOpen = true;
    }
    if (node.data.isOpen) {
      setPopupData({
        title: node.data.title,
        content: node.data.content,
        nodeId: node.id
      });
      return;
    }



    setPopupData({
      title: node.data.title,
      content: node.data.content + '\n\n' + 'loading...',
      nodeId: node.id 
    })
    setIsLoading(true);

    contentRef.current = node.data.content ;

    try {
      const response = await fetch(`${backendapi}/api/expand_node`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: data.topic,
          node_id: node.id,
          title: node.data.title,
          content: node.data.content
        }),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(response)

      contentRef.current = '' ;

      // Read the response body as JSON
      const text = await response.text();  // Parse manually // Parses the entire response in one go
      const lines = text.split('\n') ;
      for(const line of lines){
        if(line.trim() != ''){
          const response_data = JSON.parse(line) ;
          if(response_data.content){
            contentRef.current += response_data.content ;
            
            setPopupData(prevData => ({
              ...prevData,
              content: contentRef.current
            }))
          } else if(response_data.error){
            console.log('error: ', response_data.error) ;
          }
        }
      }

      // Update the nodes state to reflect the change, change the outlook of node with n.id == node.id
      setNodes(nodes.map(n => 
        n.id === node.id 
          ? { ...n, data: { ...n.data, content: contentRef.current, isOpen: true }}
          : n
      ));

    } catch (error) {
      console.error('Error expanding the node', error);
    } finally {
      setIsLoading(false);
    }
  }, [data.topic, nodes, setNodes, setPopupData, setIsLoading]);

  const handleSendToBackend = useCallback(async (inputQuery) => {
      const updatedContent = `${popupData.content}\n\n**user:** ${inputQuery}\n\n...`;
     
      // Update popupData with the new content including the user's question
      setPopupData(prevData => ({
        ...prevData,
        content: updatedContent
      }));


    console.log(inputQuery)
    console.log(popupData.content)
    console.log("kucchi09")
    if (popupData) {
      try {
        const response = await fetch(`${backendapi}/api/node_question`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic: data.topic,
            node_id: popupData.nodeId,
            question: inputQuery,
            context: updatedContent
          }),
        });
        if (!response.ok) {
          console.log(response)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const finalContent = `${updatedContent}\n\n${result.answer}`;

        // console.log('Backend response:', result);

        setPopupData(prevData => ({
          ...prevData,
          content: finalContent
        }));

      // Update the nodes state to reflect the change
      // console.log(popupData.content)
      setNodes(nodes.map(n => 
        n.id === popupData.nodeId 
          ? { ...n, data: { ...n.data, content:  finalContent, isOpen: true }}
          : n
      ));

      } catch (error) {
        console.error('Error sending question to backend', error);
      }
    }
  }, [data.topic, popupData, nodes, setNodes]);

  const onNodeClick = useCallback((event, node) => {
    expandNode(node);
  }, [expandNode]);

  const closePopup = () => {
    setPopupData(null);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        style={{ background: '#000000' }}
        defaultEdgeOptions={{
          type: "default",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#436e86',
          },
          style: { stroke: '#436e86', strokeWidth: 2 },
        }}
      >
        <Background color="#ff12f0" gap={16}/>
        {popupData && (
          <Popup
            title={popupData.title}
            content={popupData.content}
            onClose={closePopup}
            onSendToBackend={handleSendToBackend}
            isLoading={isLoading}
          />
        )}
      </ReactFlow>
    </div>
  );
};

export default Graph;
