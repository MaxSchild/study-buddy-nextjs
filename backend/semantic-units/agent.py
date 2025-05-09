import asyncio
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion, AzureChatCompletion
from semantic_kernel.prompt_template import PromptTemplateConfig
import os

from dotenv import load_dotenv
load_dotenv()

service_id="document_classification"
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")

def agent(deployment_name, prompt: str, max_tokens=2000):
    kernel = Kernel()

    kernel.add_service(
        AzureChatCompletion(
            service_id=service_id,
            deployment_name=deployment_name,
            endpoint=endpoint,
        )
    )

    # Define the request settings
    req_settings = kernel.get_prompt_execution_settings_from_service_id(service_id)
    req_settings.max_tokens = 2000
    req_settings.temperature = 0.7
    req_settings.top_p = 0.8

    prompt_template_config = PromptTemplateConfig(
        template=prompt,
        name=service_id,
        template_format="semantic-kernel",
        execution_settings=req_settings,
    )
    
    function = kernel.add_function(
        function_name=f"{service_id}_function",
        plugin_name=f"{service_id}_plugin",
        prompt_template_config=prompt_template_config,
    )

    async def invocation(function):
        return await kernel.invoke(function)
    
    result = asyncio.run(invocation(function))
    
    return result