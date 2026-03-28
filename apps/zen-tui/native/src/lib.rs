#[macro_use]
extern crate napi_derive;

#[napi]
pub fn zen_test() -> String {
    "ZEN_OK".to_string()
}

pub(crate) mod runtime;

pub use runtime::layout::ZenLayoutEngine;
pub use runtime::input::ZenInput;
pub use runtime::renderer::ZenBuffer;
