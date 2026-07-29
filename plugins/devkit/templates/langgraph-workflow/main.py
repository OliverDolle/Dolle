"""Run the {{PROJECT_NAME}} workflow."""
from dotenv import load_dotenv

from app.graph import build_graph


def main() -> None:
    load_dotenv()
    graph = build_graph()
    config = {"configurable": {"thread_id": "demo"}}

    result = graph.invoke(
        {"messages": [{"role": "user", "content": "Hello! What can you do?"}]},
        config,
    )
    print(result["messages"][-1].content)


if __name__ == "__main__":
    main()
