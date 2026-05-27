from llmlingua import PromptCompressor
import gc

class Com100X:
    def __init__(self):
        print("Initializing Com100X Compression Core...")
        print("Loading XLM-RoBERTa MeetingBank model (~1.5GB RAM) on CPU...")
        self.compressor = PromptCompressor(
            model_name="microsoft/llmlingua-2-xlm-roberta-large-meetingbank",
            use_llmlingua2=True,
        )
        print("Com100X Core Ready.")

    def compress(self, text: str, target_ratio: float = 0.4):
        """
        Compresses the prompt to target_ratio (e.g. 0.4 means shrink to 40% of original size)
        """
        try:
            results = self.compressor.compress_prompt(
                context=[text],
                instruction="",
                question="",
                target_token=0,
                rate=target_ratio,
                force_tokens=['\n', '.', '!', '?', ',', 'System', 'Rule']
            )
            return {
                "compressed_text": results['compressed_prompt'],
                "original_tokens": results['origin_tokens'],
                "compressed_tokens": results['compressed_tokens'],
                "saved_ratio": results['ratio']
            }
        except Exception as e:
            return {"error": str(e)}
        finally:
            gc.collect()
