 "use client"; // This directive is needed for client components
 
 import React from 'react';
 
 export const DemoEventButton = () => {
 
     const handleCreateDemoEvent = async () => {
         try {
             const response = await fetch('/api/events/demo', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 // The demo endpoint doesn't strictly require a body,
                 // but sending an empty JSON object is good practice.
                 body: JSON.stringify({}),
             });
 
             if (response.ok) {
                 const result = await response.json();
                 console.log('Demo event created successfully:', result);
                 alert('Demo event created successfully! Check your database.');
             } else {
                 const errorData = await response.json();
                 console.error('Failed to create demo event:', errorData);
                 alert(`Failed to create demo event: ${errorData.error || response.statusText}`);     
             }
         } catch (error) {
             console.error('An error occurred while creating the demo event:', error);
             alert('An error occurred while creating the demo event. Check the console for details.');
         }
     };
 
     return (
         <div>
             <button
                 onClick={handleCreateDemoEvent}
                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"     
             >
                 Create Demo Event
             </button>
         </div>
     );
};