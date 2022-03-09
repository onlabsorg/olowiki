export default {

    homePath: '/',
    
    helpPath: '/.wiki/help/index',
    
    tree: [
        
        {
            name: "Home",
            id: '/',
            mutable: true,
            children: []
        },
        
        {   name: "Group 1",  
            id: "/dir1/",  
            children: [
        
                {name: "Document 1.1", id: "/dir1/doc1"},
                {name: "Document 1.2", id: "/dir1/doc2"},
                {name: "Document 1.3", id: "/dir1/doc3"} 
                
                ]
            },

        {   name: "Group 2",  
            id: "/dir2/",  
            children: [

                {name: "Document 2.1", id: "/dir2/doc1"},
                {name: "Document 2.2", id: "/dir2/doc2"},
                {name: "Document 2.3", id: "/dir2/doc3"} 
                
                ]
            },

        {   name: "Group 3",  
            id: "/dir3/",  
            children: [
        
                {name: "Document 3.1", id: "/dir3/doc1"},
                {name: "Document 3.2", id: "/dir3/doc2"},
                {name: "Document 3.3", id: "/dir3/doc3"} 
                
                ]
            },

        {name: "Document 0.1",  id: "/doc1"},
        {name: "Document 0.2",  id: "/doc2"},
        {name: "Document 0.3",  id: "/doc3"}
        
    ]
}