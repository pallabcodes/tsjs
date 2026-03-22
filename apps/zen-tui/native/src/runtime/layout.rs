use taffy::prelude::*;
use napi_derive::napi;
use std::collections::HashMap;

#[napi]
pub struct ZenLayoutEngine {
    taffy: TaffyTree<()>,
    nodes: HashMap<u32, NodeId>,
    next_id: u32,
}

#[napi]
impl ZenLayoutEngine {
    #[napi(constructor)]
    pub fn new() -> Self {
        Self {
            taffy: TaffyTree::new(),
            nodes: HashMap::new(),
            next_id: 1,
        }
    }

    #[napi]
    pub fn create_node(&mut self, 
        flex_direction: String, 
        width: Option<f64>, 
        height: Option<f64>,
        flex_grow: Option<f64>,
        padding_top: Option<f64>,
        padding_right: Option<f64>,
        padding_bottom: Option<f64>,
        padding_left: Option<f64>,
        gap: Option<f64>
    ) -> u32 {
        let mut style = Style::DEFAULT;
        
        style.flex_direction = match flex_direction.as_str() {
            "row" => FlexDirection::Row,
            "column" => FlexDirection::Column,
            _ => FlexDirection::Column,
        };

        if let Some(w) = width { style.size.width = length(w as f32); }
        if let Some(h) = height { style.size.height = length(h as f32); }
        if let Some(g) = flex_grow { style.flex_grow = g as f32; }
        
        if let Some(p) = padding_top { style.padding.top = length(p as f32); }
        if let Some(p) = padding_right { style.padding.right = length(p as f32); }
        if let Some(p) = padding_bottom { style.padding.bottom = length(p as f32); }
        if let Some(p) = padding_left { style.padding.left = length(p as f32); }

        if let Some(g) = gap { style.gap = length(g as f32); }

        let node = self.taffy.new_leaf(style).unwrap();
        let id = self.next_id;
        self.nodes.insert(id, node);
        self.next_id += 1;
        id
    }

    #[napi]
    pub fn add_child(&mut self, parent_id: u32, child_id: u32) {
        let parent = *self.nodes.get(&parent_id).expect("Parent node not found");
        let child = *self.nodes.get(&child_id).expect("Child node not found");
        self.taffy.add_child(parent, child).expect("Failed to add child");
    }

    #[napi]
    pub fn compute_layout(&mut self, root_id: u32, available_width: f64, available_height: f64) -> Vec<f64> {
        let root = *self.nodes.get(&root_id).expect("Root node not found");
        self.taffy.compute_layout(
            root, 
            Size { 
                width: AvailableSpace::Definite(available_width as f32), 
                height: AvailableSpace::Definite(available_height as f32) 
            }
        ).expect("Failed to compute layout");

        // Flatten results into a buffer: [id, x, y, w, h, ...]
        let mut results = Vec::new();
        // Return results for all nodes tracked by the engine
        for (&id, &node) in &self.nodes {
            let layout = self.taffy.layout(node).expect("Failed to get node layout");
            results.push(id as f64);
            results.push(layout.location.x as f64);
            results.push(layout.location.y as f64);
            results.push(layout.size.width as f64);
            results.push(layout.size.height as f64);
        }
        results
    }
}
